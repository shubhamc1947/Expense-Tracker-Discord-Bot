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
  const username = interaction.user.username;

  // 🔹 /addexpense
  if (interaction.commandName === 'addexpense') {
    const amount = interaction.options.getString('amount');
    const category = interaction.options.getString('category');
    const description = interaction.options.getString('description') || 'No description';
    const timestamp = new Date().toLocaleString();

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:E',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[timestamp, username, amount, category, description]],
        },
      });

      const embed = new EmbedBuilder()
        .setTitle('✅ Expense Added')
        .setColor(0x00FF00)
        .addFields(
          { name: 'Amount', value: `₹${amount}`, inline: true },
          { name: 'Category', value: category, inline: true },
          { name: 'Description', value: description },
        )
        .setFooter({ text: `Added by ${username}` })
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
        range: 'Sheet1!A:E',
      });

      console.log('Google Sheet Data:', res.data.values); // Log the data for debugging

      const rows = res.data.values;
      const userRows = rows.filter(row => row[1] === username);
      if (userRows.length === 0) {
        return interaction.reply('You have no expenses recorded.');
      }

      const embed = new EmbedBuilder()
        .setTitle(`🧾 All Expenses for ${username}`)
        .setColor(0x3498db)
        .setTimestamp();

      userRows.forEach(row => {
        const [date, , amount, category, desc] = row;
        embed.addFields({ name: `${category} - ₹${amount}`, value: `${desc} (${date})` });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error:', err);
      await interaction.reply('Error retrieving expenses.');
    }
  }

  // 🔹 /summary (Last 5 Transactions)
  if (interaction.commandName === 'summary') {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:E',
      });

      console.log('Google Sheet Data:', res.data.values); // Log the data for debugging

      const rows = res.data.values;
      const userRows = rows.filter(row => row[1] === username);
      const recentTransactions = userRows.slice(-5).reverse(); // Last 5 transactions

      if (recentTransactions.length === 0) {
        return interaction.reply('No recent transactions found.');
      }

      const embed = new EmbedBuilder()
        .setTitle(`🧾 Last 5 Transactions for ${username}`)
        .setColor(0xf1c40f)
        .setTimestamp();

      recentTransactions.forEach(row => {
        const [date, , amount, category, desc] = row;
        embed.addFields({ name: `${category} - ₹${amount}`, value: `${desc} (${date})` });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error:', err);
      await interaction.reply('Error retrieving summary.');
    }
  }

  // 🔹 /setbudget (Set Monthly Budget)
  if (interaction.commandName === 'setbudget') {
    const budget = interaction.options.getNumber('budget');
    const timestamp = new Date().toLocaleString();

    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `Sheet1!G2`, // Assuming G2 is where budget is saved
        valueInputOption: 'RAW',
        requestBody: {
          values: [[budget, timestamp]],
        },
      });

      const embed = new EmbedBuilder()
        .setTitle('✅ Budget Set')
        .setColor(0x00FF00)
        .addFields(
          { name: 'Monthly Budget', value: `₹${budget}`, inline: true },
          { name: 'Set On', value: timestamp },
        )
        .setFooter({ text: `Budget set by ${username}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ Error:', error);
      await interaction.reply('There was an error setting your budget.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
