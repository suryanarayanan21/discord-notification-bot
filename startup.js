const fs = require("fs");
const { Collection } = require("discord.js");

let attachEventListeners = (client) => {
  const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

  eventFiles.forEach((file) => {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
};

let attachCommands = (client) => {
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  });
};

module.exports = { attachCommands, attachEventListeners };
