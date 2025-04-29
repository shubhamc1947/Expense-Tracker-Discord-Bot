Here's a detailed `README.md` for your project, explaining all the setup steps for the bot:

```markdown
# Expense Tracker Discord Bot

This project is a Discord bot that helps users track their expenses by logging them into Google Sheets. The bot allows users to add expenses, view all expenses, see a summary of the last 5 transactions, and set a monthly budget. The bot interacts with the user through slash commands and stores data in a Google Sheets document.

## Features
- **/addexpense**: Add a new expense with an amount, category, and optional description.
- **/listexpenses**: List all expenses for the user.
- **/summary**: Get a summary of the last 5 transactions for the user.
- **/setbudget**: Set a monthly budget.

## Prerequisites
Before setting up the bot locally, make sure you have the following:
- **Node.js** installed (version 16 or higher recommended).
- **Google Sheets API enabled** and a **Google Service Account** created to access the Sheets API.
- **Discord Developer Account** with your bot created and token ready.

## Setting Up Your Environment

### Step 1: Clone the Repository
Clone this repository to your local machine.

```bash
git clone https://github.com/your-repository/discord-expense-bot.git
cd discord-expense-bot
```

### Step 2: Install Dependencies
Install the required dependencies using npm.

```bash
npm install
```

### Step 3: Create a `.env` File
Create a `.env` file in the root of your project and add the following environment variables:

```ini
# Discord Bot Token
DISCORD_TOKEN=your_discord_bot_token

# Your Discord Client ID (found in the Discord Developer Portal)
CLIENT_ID=your_discord_client_id

# Google Sheets API credentials (see instructions below for setting up Google Sheets API)
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_service_account_credentials.json

# Google Sheets ID (found in the URL of your Google Sheets document)
GOOGLE_SHEET_ID=your_google_sheet_id
```

#### Explanation of Environment Variables:
- `DISCORD_TOKEN`: Your bot's token. You can get this from the [Discord Developer Portal](https://discord.com/developers/applications).
- `CLIENT_ID`: Your bot's client ID, which is used when registering the commands with Discord.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google service account credentials JSON file. This file is generated when you create a service account on Google Cloud and enable the Google Sheets API.
- `GOOGLE_SHEET_ID`: The ID of your Google Sheets document where expenses will be logged.

### Step 4: Set Up Google Sheets API
Follow these steps to set up Google Sheets API access:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Navigate to the **API & Services** > **Library** and enable the **Google Sheets API**.
4. Navigate to **APIs & Services** > **Credentials**.
5. Create a **Service Account** and download the credentials as a JSON file.
6. Share the Google Sheets document with the service account email (found in the JSON file, under `"client_email"`).
7. Save the downloaded JSON credentials file in your project directory.

### Step 5: Create the Google Sheet
Create a Google Sheets document to store the expenses. You can start with the following structure:

| Date & Time       | Amount | Category  | Description |
|-------------------|--------|-----------|-------------|
| 2025-04-29 12:00  | 100    | Food      | Lunch       |
| ...               | ...    | ...       | ...         |

- Make sure the sheet has the appropriate columns for `Date & Time`,`Amount`, `Category`, `Description`, `Budget`, and `Budget Set On`.

### Step 6: Register Slash Commands
Run the following command to register your bot's slash commands with Discord:

```bash
node register-commands.js
```

This will use the `DISCORD_TOKEN` and `CLIENT_ID` environment variables to register the commands. You only need to run this command once after setting up the bot or if you modify the commands.

### Step 7: Running the Bot
Start the bot using the following command:

```bash
node index.js
```

The bot should now be online and ready to receive commands on your Discord server.

### Step 8: Invite the Bot to Your Server
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your bot application.
3. Under **OAuth2** > **OAuth2 URL Generator**:
   - Select **bot** as the scope.
   - Under **OAuth2 URL Generator** > **Bot Permissions**, select the necessary permissions (e.g., `Send Messages`, `Read Message History`, `Use Slash Commands`).
4. Copy the generated URL and use it to invite your bot to your Discord server.

### Step 9: Using the Bot
Once the bot is in your server, you can interact with it using the following commands:

- `/addexpense amount:<amount> category:<category> description:<description>`: Add an expense with a specific amount, category, and optional description.
- `/listexpenses`: List all your recorded expenses.
- `/summary`: Get a summary of the last 5 transactions.
- `/setbudget budget:<amount>`: Set your monthly budget.

The bot will reply with an embedded message confirming the action and providing relevant information.

## Troubleshooting

- **Bot Not Responding**: Make sure the bot has the necessary permissions in your Discord server and that the token in `.env` is correct.
- **Google Sheets Errors**: Ensure your service account has access to the Google Sheet and that the `GOOGLE_APPLICATION_CREDENTIALS` file path is correct.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Key Highlights:
- **Step-by-step guide** for setting up your local environment, from creating a bot on Discord to integrating the Google Sheets API.
- **Clear explanation of `.env` variables** to ensure smooth configuration.
- **Command registration instructions** to make sure your bot's slash commands are available to users.
