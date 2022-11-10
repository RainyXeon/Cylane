const mongoose = require('mongoose');

const CreateReconnect = mongoose.Schema({
  guild: {
		type: String,
		required: true,
		unique: true,
	},
  text: {
		type: String,
		required: true,
		unique: true,
	},
  voice: {
		type: String,
		required: true,
		unique: true,
	},
});

module.exports = mongoose.model('Reconnect', CreateReconnect);