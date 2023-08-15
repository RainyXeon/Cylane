// Parse function from
// https://github.com/mrstebo/node-env-config-file-loader/blob/master/lib/variable-injector.js
// Special thanks to https://github.com/mrstebo
var _ = require("lodash");
require("dotenv").config();
const boolean = ["true", "false", "null", "undefined"];

function parseBoolean(value) {
  if (typeof value === "string") {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case true:
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

module.exports = (contents) => {
  var re = /\${(.*?)\}/;
  var matches;
  var result = contents;

  do {
    matches = re.exec(result);

    if (matches) {
      if (
        process.env[matches[1]] &&
        boolean.includes(process.env[matches[1]].trim().toLowerCase())
      ) {
        const boolean_prase_res = parseBoolean(process.env[matches[1]]);
        return (result = _.replace(result, matches[0], boolean_prase_res));
      }
      result = _.replace(result, matches[0], process.env[matches[1]]);
    }
  } while (matches);

  return result;
};
