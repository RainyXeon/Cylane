const mongoose = require('mongoose');

const CreateGuild = mongoose.Schema({
    guild: {
      type: String,
      required: true,
      unique: true,
	  },
    enable: Boolean,
    channel: String,
    playmsg: String,
    queuemsg: String,
    voice: String,
    category: String
});

module.exports = mongoose.model('Setup', CreateGuild);