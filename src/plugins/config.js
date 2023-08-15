const yaml = require("js-yaml");
const { prase } = require("./prase/index.js");

const yaml_files = prase("./application.yml");
let doc;

try {
  const res = yaml.load(yaml_files, "utf8");
  doc = res;
} catch (e) {
  console.log(e);
}

module.exports = doc;
