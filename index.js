const { Client, Intents } = require("discord.js");
const server = require("express")();
const {
  attachEventListeners,
  attachCommands,
  attachRoutes,
  registerCommands,
} = require("./startup");

// In Dev environment, load environment file
if (process.env.ENVIRONMENT === "DEV") require("dotenv").config();

// Register Commands Globally on Discord
registerCommands();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
attachEventListeners(client);
attachCommands(client);

// Initialize Server
// Also Pass arguements that are needed for use within the routes
attachRoutes(server, { client });
server.listen(process.env.PORT, () => {
  console.log(`Server listening at Port: ${process.env.PORT}`);
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
