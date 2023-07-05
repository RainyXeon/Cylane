const yaml = require('js-yaml');
const fs = require('fs');
const prase = require("./prase")

const file = fs.readFileSync('./application.yml', 'utf8')
const yaml_files = prase(file)
let doc

try {
  const res = yaml.load(yaml_files, 'utf8');
  doc = res
} catch (e) {
  console.log(e);
}

module.exports = doc