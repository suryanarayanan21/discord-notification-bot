const fs = require("fs");
const pathModule = require("path");
const router = require("express").Router();
const { Collection } = require("discord.js");

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

let setRouteFunctions = (router) => {
  let allFiles = getAllFileNamesRecursive(__dirname + pathModule.sep + "api");

  allFiles.forEach((fileName) => {
    let relativeName = pathModule.relative(__dirname, fileName);
    let routeWithExtension = relativeName
      .split(pathModule.sep)
      .join(pathModule.posix.sep);
    let route = routeWithExtension.slice(0, -3);
    let { handler } = require(fileName);
    handler(router.route(`/${route}`));
  });
};

let attachRoutes = (server) => {
  console.log("Fetching Server Route Handlers...");
  setRouteFunctions(router);
  server.use("/", router);
  console.log("Registered Server Routes");
};

module.exports = { attachCommands, attachEventListeners, attachRoutes };
