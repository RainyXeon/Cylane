const readline = require("./readline.js");
const _ = require("lodash");
require("dotenv").config();

const boolean = ["true", "false", "null", "undefined"];

function parseBoolean(value) {
  if (typeof value === "string") {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case "true":
      return true;
    case "null":
      return "null";
    case "undefined":
      return undefined;
    default:
      return false;
  }
}

function prase(path) {
  const line = readline(path);
  const res_array = [];

  for (let i = 0; i < line.length; i++) {
    var element = line[i];
    var re = /\${(.*?)\}/;

    if (re.exec(element) !== null || re.exec(element)) {
      const extract = re.exec(element);
      if (
        process.env[extract[1]] &&
        boolean.includes(process.env[extract[1]].trim().toLowerCase())
      ) {
        const boolean_prase_res = parseBoolean(process.env[extract[1]]);
        res_array.push(_.replace(element, extract[0], boolean_prase_res));
      } else {
        res_array.push(_.replace(element, extract[0], process.env[extract[1]]));
      }
    } else {
      res_array.push(element);
    }
  }

  return res_array.join("\r\n");
}

module.exports = { prase };
