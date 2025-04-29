const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('addexpense')
    .setDescription('Add a new expense')
    .addStringOption(option =>
      option.setName('amount')
        .setDescription('Expense amount')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Expense category')
        .setRequired(true)
        .addChoices(
          { name: 'Food', value: 'Food' },
          { name: 'Transport', value: 'Transport' },
          { name: 'Shopping', value: 'Shopping' },
          { name: 'Other', value: 'Other' }
        ))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Expense description')
        .setRequired(false)),
  new SlashCommandBuilder()
    .setName('listexpenses')
    .setDescription('List all expenses'),
  new SlashCommandBuilder()
    .setName('summary')
    .setDescription('Get total of all transactions'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log('⏳ Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('✅ Slash commands registered.');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();
