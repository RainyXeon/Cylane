const mongoose = require('mongoose');

const CreateGuild = mongoose.Schema({
    guild: {
		type: String,
		required: true,
		unique: true,
	},
    test: {
        type: String,
    }
});

module.exports = mongoose.model('guildconfig', CreateGuild);