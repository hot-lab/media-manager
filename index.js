"use strict";

const config = require("./config-loader");

console.log("config >>>", config);

process.exit();

const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = (relativePath) => path.resolve(appDirectory, relativePath);

const imgDir = "src/assets/img";
const iconDir = "src/assets/icon";

const extNameList = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"];

const toCamelCase = (str) =>
  str.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());

const createCode = (dir, subStr = "Img") => {
  const list = fs.readdirSync(dir).reduce((prev, current) => {
    const pathname = path.join(dir, current);

    if (!fs.statSync(pathname).isDirectory()) {
      const { ext, name } = path.parse(pathname);
      const extName = ext.toLowerCase();
      const fileName = toCamelCase(name);

      const regExp = /^[a-z_][0-9a-z_]+$/;

      if (!regExp.test(fileName)) {
        console.error("invalid file:", pathname);
        process.exit();
      }

      if (
        extNameList.find((name) => name === extName) &&
        !prev.find(({ fileName: fName }) => fName === fileName)
      ) {
        prev.push({ pathname, fileName });
      }
    }

    return prev;
  }, []);

  const jsCode =
    list.reduce(
      (prev, { fileName, pathname }) =>
        `${prev}import ${fileName}${subStr} from "${pathname}";\n`,
      ""
    ) +
    `\nexport {${list
      .map(({ fileName }) => `${fileName}${subStr}`)
      .toString()
      .replaceAll(",", ",\n  ")}};`
      .replace("{", "{\n")
      .replace("}", "\n}");

  fs.writeFileSync(`${imgDir}/index.js`, jsCode);
};

createCode(imgDir);
createCode(iconDir, "Icon");
