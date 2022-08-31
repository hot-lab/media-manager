"use strict";

// 判断文件是否存在于项目根目录，若存在则加载该文件并返回，否则返回 null

const fs = require("fs");

const chalk = require("./configured-chalk.js");

const resolvePath = require("./resolve-path.js");

// 合法模块后缀名
const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

const requireRootModule = (filePath) => {
  const isIllegalModule = moduleFileExtensions.find((extension) =>
    filePath.endsWith(`.${extension}`)
  );

  if (!isIllegalModule) {
    console.log(chalk.error(`${filePath} 不是一个合法的模块`));
    process.exit(1);
  }

  const isFle = fs.existsSync(resolvePath(filePath));

  if (isFle) return require(resolvePath(filePath));

  console.log(`${filePath} is not exist`);

  return null;
};

module.exports = requireRootModule;
