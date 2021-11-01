const { Client, Intents } = require("discord.js");
const { attachEventListeners, attachCommands } = require("./startup");

// In Dev environment, load environment file
require("dotenv").config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
attachEventListeners(client);
attachCommands(client);

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
