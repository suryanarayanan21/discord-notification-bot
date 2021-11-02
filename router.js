const fs = require("fs");
const pathModule = require("path");
const router = require("express").Router();

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
  let allFiles = getAllFileNamesRecursive(__dirname);

  allFiles.forEach((fileName) => {
    if (fileName === __filename) return;
    let relativeName = pathModule.relative(__dirname + "\\..", fileName);
    let routeWithExtension = relativeName
      .split(pathModule.sep)
      .join(pathModule.posix.sep);
    let route = routeWithExtension.slice(0, -3);
    let { handler } = require(fileName);
    handler(router.route(`/${route}`));
  });
};

let getRouter = () => {
  setRouteFunctions(router);
  return router;
};

module.exports = { getRouter };
