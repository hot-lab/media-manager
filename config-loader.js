"use strict";

const _ = require("lodash");

const requireRootModule = require("./require-module.cjs");

const defaultConfig = require("./config.default");

const packageJsonConfig = requireRootModule("package.json").mmconfig;

const fileConfig = requireRootModule("mmconfig.js");

const userConfig = fileConfig || packageJsonConfig;

if (!userConfig) {
  module.exports = defaultConfig;
}

module.exports = _.merge(defaultConfig, userConfig);
