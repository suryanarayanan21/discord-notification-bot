const { Client, Intents } = require("discord.js");
const server = require("express")();
const {
  attachEventListeners,
  attachCommands,
  attachRoutes,
} = require("./startup");

// In Dev environment, load environment file
if (process.env.ENVIRONMENT === "DEV") require("dotenv").config();

// Initialize Server

attachRoutes(server);
server.listen(process.env.PORT, () => {
  console.log(`Server listening at Port: ${process.env.PORT}`);
});

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
attachEventListeners(client);
attachCommands(client);

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
