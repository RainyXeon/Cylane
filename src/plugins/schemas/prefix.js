const mongoose = require('mongoose');
const yaml = require('js-yaml');
const fs   = require('fs');

let doc

try {
  const yaml_files = yaml.load(fs.readFileSync('./application.yml', 'utf8'));
  doc = yaml_files
} catch (e) {
  console.log(e);
}


const GuildConfigSchema = new mongoose.Schema({
	guild: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true,
	},
	prefix: {
		type: mongoose.SchemaTypes.String,
		required: true,
		default: doc.bot.PREFIX || "d!",
	},
})

module.exports = mongoose.model('Prefix', GuildConfigSchema)