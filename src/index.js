"use strict";

const _ = require("lodash");

const { configLoader, resolvePath, chalk } = require("@onelab/dev-utils");

const config = configLoader("config.default.js", "mmConfig", "mmConfig.js");

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

const createCode = (dir, config) => {
  const dirPath = resolvePath(dir);
  const { fileTypes, logLevel, prefix, suffix, illegalPrefix, impportSvgAs } =
    config;

  const list = fs.readdirSync(dirPath).reduce((prev, current) => {
    const pathName = path.join(dir, current);

    if (isDir(pathName)) {
      return prev;
    }

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

    const isValidFileTest = /^[a-z_][0-9a-z_]+$/;

    if (!isValidFileTest.test(fileName)) {
      const logMsg = `invalid fileName: ${pathName}`;
      switch (logLevel) {
        case "alert":
          console.log(chalk.warn(logMsg));
          break;
        case "error":
          console.error(chalk.error(logMsg));
          process.exit(1);
        default:
          break;
      }
    }

    if (!prev.find(({ fileName: fName }) => fName === fileName)) {
      prev.push({ pathName, fileName, extName });
    }

    return prev;
  }, []);

  const jsCode =
    list.reduce(
      (prev, { fileName, pathName, extName }) =>
        `${prev}import ${fileName} from "${pathName}";\n` + extName === ".svg"
          ? `import ReactComponent as ${fileName.replace(/^\S/, (s) =>
              s.toUpperCase()
            )}Component from "${pathName}";\n`
          : "",
      ""
    ) +
    `\nexport {${list
      .map(({ fileName }) => fileName)
      .toString()
      .replaceAll(",", ",\n  ")}};`
      .replace("{", "{\n")
      .replace("}", "\n}");

  fs.writeFileSync(`${dirPath}/index.js`, jsCode);
};

config.folders.forEach(
  (folder) =>
    isFile(folder.path) && createCode(folder.path, _.merge(config, folder))
);
