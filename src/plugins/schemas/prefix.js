const mongoose = require('mongoose');

const GuildConfigSchema = new mongoose.Schema({
	guild: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true,
	},
	prefix: {
		type: mongoose.SchemaTypes.String,
		required: true,
		default: process.env.PREFIX,
	},
})

module.exports = mongoose.model('GuildConfig', GuildConfigSchema)