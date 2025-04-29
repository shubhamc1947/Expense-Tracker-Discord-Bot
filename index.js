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

  if (interaction.commandName === 'addexpense') {
    const amount = interaction.options.getString('amount');
    const category = interaction.options.getString('category');
    const description = interaction.options.getString('description') || 'No description';
    const timestamp = new Date().toLocaleString();
    const username = interaction.user.username;

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

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
});

client.login(process.env.DISCORD_TOKEN);
