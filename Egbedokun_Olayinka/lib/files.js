const fs = require("fs");
const path = require("path");

const getCurrentDirectory = () => {
  return path.basename(process.cwd());
};

const directoryExists = (filePath) => {
  return fs.existsSync(filePath);
};

module.exports = { getCurrentDirectory, directoryExists };
