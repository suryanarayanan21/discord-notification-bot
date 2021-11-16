const fs = require("fs");
const pathModule = require("path");
const express = require("express");
const router = express.Router();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Collection } = require("discord.js");
const { initializeApp } = require("firebase/app");

let initializeFirestore = () => {
  console.log("Initializing Firebase");
  const firebaseApp = initializeApp({
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
  });
  console.log("Initialized Firebase");
};

let attachEventListeners = (client) => {
  console.log("Fetching Event Listeners...");

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

  console.log("Registered Event Listeners");
};

let attachCommands = (client) => {
  console.log("Fetching Commands...");
  client.commands = new Collection();
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
  });
  console.log("Fetched Commands and Handlers");
};

let getAllFileNamesRecursive = (path) => {
  let directoryItems = fs.readdirSync(path, { withFileTypes: true });

  let files = directoryItems
    .filter((item) => !item.isDirectory() && item.name.endsWith(".js"))
    .map((file) => path + pathModule.sep + file.name);

  let folders = directoryItems
    .filter((item) => item.isDirectory())
    .map((folder) => path + pathModule.sep + folder.name);

  folders.forEach((folder) => {
    let _files = getAllFileNamesRecursive(folder);
    files.push(..._files);
  });

  return files;
};

let setRouteFunctions = (router, args) => {
  let allFiles = getAllFileNamesRecursive(__dirname + pathModule.sep + "api");

  allFiles.forEach((fileName) => {
    let relativeName = pathModule.relative(__dirname, fileName);
    let routeWithExtension = relativeName
      .split(pathModule.sep)
      .join(pathModule.posix.sep);
    let route = routeWithExtension.slice(0, -3);
    let { handler } = require(fileName);
    router.use(express.json());
    handler(router.route(`/${route}`), args);
  });
};

let attachRoutes = (server, args) => {
  console.log("Fetching Server Route Handlers...");
  setRouteFunctions(router, args);
  server.use("/", router);
  console.log("Registered Server Routes");
};

let registerCommands = () => {
  const commands = [];
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  });

  const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

  rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
};

module.exports = {
  attachCommands,
  attachEventListeners,
  attachRoutes,
  registerCommands,
  initializeFirestore,
};
