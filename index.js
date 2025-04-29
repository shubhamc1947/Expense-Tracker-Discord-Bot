const { Client, GatewayIntentBits, EmbedBuilder, Events } = require('discord.js');
const { google } = require('googleapis');
require('dotenv').config();
const path = require('path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  // 🔹 /addexpense
  if (interaction.commandName === 'addexpense') {
    const amount = parseFloat(interaction.options.getString('amount'));
    const category = interaction.options.getString('category');
    const description = interaction.options.getString('description') || 'No description';
    const timestamp = new Date().toLocaleString();

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:D',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[timestamp, amount, category, description]],
        },
      });

      // Calculate total expenses
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:C',
      });

      const rows = res.data.values;
        const totalExpenses = rows.slice(1).reduce((acc, row) => acc + parseFloat(row[1] || 0), 0);

        

      const embed = new EmbedBuilder()
        .setTitle('✅ Expense Added')
        .setColor(0x00FF00)
        .addFields(
          { name: 'Amount', value: `₹${amount}`, inline: true },
          { name: 'Category', value: category, inline: true },
          { name: 'Description', value: description },
        )
        .addFields({ name: 'Total Expenses', value: `₹${totalExpenses}` })
        .setFooter({ text: `Added at ${timestamp}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ Error:', error);
      await interaction.reply('There was an error adding your expense.');
    }
  }

  // 🔹 /listexpenses (All Expenses)
  if (interaction.commandName === 'listexpenses') {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:D',
      });

      const rows = res.data.values;
      if (rows.length === 0) {
        return interaction.reply('No expenses recorded.');
      }

      const embed = new EmbedBuilder()
        .setTitle(`🧾 All Expenses`)
        .setColor(0x3498db)
        .setTimestamp();

      rows.forEach(row => {
        const [date, amount, category, description] = row;
        embed.addFields({ name: `${category} - ₹${amount}`, value: `${description} (${date})` });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error:', err);
      await interaction.reply('Error retrieving expenses.');
    }
  }

  // 🔹 /summary (Total of All Transactions)
  if (interaction.commandName === 'summary') {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:D',
      });

      const rows = res.data.values;
      const totalAmount = rows.slice(1).reduce((acc, row) => acc + parseFloat(row[1] || 0), 0);


      if (rows.length === 0) {
        return interaction.reply('No transactions found.');
      }

      const embed = new EmbedBuilder()
        .setTitle('🧾 Total Expense Summary')
        .setColor(0xf1c40f)
        .addFields({ name: 'Total Amount Spent', value: `₹${totalAmount}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error:', err);
      await interaction.reply('Error retrieving summary.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
