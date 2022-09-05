#!/usr/bin/env node

"use strict";

const _ = require("lodash");

const { configLoader, resolvePath, chalk } = require("@onelab/dev-utils");

const path = require("path");
const fs = require("fs");

const isDir = (pathName) => fs.statSync(pathName).isDirectory();
const isFile = (filePath) => fs.existsSync(resolvePath(filePath));

const toCamelCase = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9](\w)/g, (all, letter) => letter.toUpperCase());

const createModuleName = (name, pre, suff, ill) => {
  const moduleName = `${pre}${name}${suff}`;
  if (/^[0-9]/.test(name)) {
    return toCamelCase(`${ill}${moduleName}`);
  }
  return toCamelCase(moduleName);
};

const readFileList = (dir, subdir) => {
  const dirPath = resolvePath(dir);
  return fs
    .readdirSync(dirPath)
    .map((filePath) => {
      const pathName = path.join(dir, filePath);
      if (isDir(pathName)) {
        return subdir ? readFileList(pathName) : [];
      }

      return pathName;
    })
    .flat();
};

const createCode = (dir, config) => {
  const {
    fileTypes,
    logLevel,
    prefix,
    suffix,
    illegalPrefix,
    subdir,
    componentName,
  } = config;

  const fileList = readFileList(dir, subdir);

  const list = fileList.reduce((prev, pathName) => {
    const { ext, name } = path.parse(pathName);
    const extName = ext.toLowerCase();

    if (!fileTypes.find((name) => name === extName)) {
      return prev;
    }

    const fileName = createModuleName(
      name,
      prefix ? `${prefix}-` : "",
      suffix ? `-${suffix}` : "",
      illegalPrefix ? `${illegalPrefix}-` : ""
    );

    const isValidFileTest = /^[a-zA-Z][0-9a-zA-Z]+$/;

    if (!isValidFileTest.test(fileName)) {
      switch (logLevel) {
        case "alert":
          console.log(chalk.warn("invalid fileName:"), pathName);
          break;
        case "error":
          console.error(chalk.warn("invalid fileName:"), pathName);
          process.exit(1);
        default:
          break;
      }
    }

    if (!prev.find(({ fileName: fName }) => fName === fileName)) {
      prev.push({ pathName, fileName, type: "image" });
      if (extName === ".svg") {
        prev.push({
          pathName,
          fileName: `${fileName}Component`,
          type: "component",
        });
      }
    }

    return prev;
  }, []);

  console.log("list >>>", list);

  const jsCode =
    list.reduce((prev, { fileName, pathName, type }) => {
      if (type === "component") {
        return `${prev}import { ${componentName} as ${fileName} } from "${pathName}";\n`;
      }
      return `${prev}import ${fileName} from "${pathName}";\n`;
    }, "") +
    `\nexport {${list
      .map(({ fileName }) => fileName)
      .toString()
      .replaceAll(",", ",\n  ")}};`
      .replace("{", "{\n  ")
      .replace("}", "\n}");

  const dirPath = resolvePath(dir);
  fs.writeFileSync(`${dirPath}/index.js`, jsCode);
};

const run = async () => {
  const config = await configLoader(
    ["@onelab/mm", "dist/lib/config.default.js"],
    "mmConfig",
    "mmConfig.js"
  );

  const { folders, ...configs } = config;

  folders.forEach(
    (folder) =>
      isFile(folder.path) && createCode(folder.path, _.merge(configs, folder))
  );
};

run();
