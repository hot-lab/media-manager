"use strict";

const chalk = require("chalk");

chalk.error = chalk.bold.red;
chalk.warning = chalk.orange;
chalk.success = chalk.green;

module.exports = chalk;
