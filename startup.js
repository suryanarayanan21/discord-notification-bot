const fs = require("fs");
const pathModule = require("path");
const { Collection } = require("discord.js");
const router = require("express").Router();

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

let getAllFileNamesRecursive = (path) => {
  let directoryItems = fs.readdirSync(path, { withFileTypes: true });

  let files = directoryItems
    .filter((item) => !item.isDirectory() && item.name.endsWith(".js"))
    .map((file) => path + "\\" + file.name);

  let folders = directoryItems
    .filter((item) => item.isDirectory())
    .map((folder) => path + "\\" + folder.name);

  folders.forEach((folder) => {
    let _files = getAllFileNamesRecursive(folder);
    files.push(..._files);
  });

  return files;
};

let setRouteFunctions = (router) => {
  let allFiles = getAllFileNamesRecursive(__dirname + "\\api");

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
  setRouteFunctions(router);
  server.use("/", router);
};

module.exports = { attachCommands, attachEventListeners, attachRoutes };
