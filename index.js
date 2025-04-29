const { Client, GatewayIntentBits } = require('discord.js');
const { google } = require('googleapis');
require('dotenv').config();
const path = require('path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Set up the Google Sheets API client
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS), // path to the downloaded credentials.json
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('/addexpense')) {
    const args = message.content.split(' ').slice(1);
    const [amount, category, ...descriptionParts] = args;
    const description = descriptionParts.join(' ');
    const timestamp = new Date().toLocaleString();

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:D',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[timestamp, amount, category, description]],
        },
      });
      message.reply('Expense added to your sheet!');
    } catch (error) {
      console.error('Error adding expense to Google Sheet:', error);
      message.reply('There was an error adding the expense. Please try again later.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
