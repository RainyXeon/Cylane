const mongoose = require('mongoose');

const CreateGuildStat = mongoose.Schema({
    guild: {
      type: String,
      required: true,
      unique: true,
	  },
    enable: Boolean,
    channel: String,
    category: String,
    statmsg: String
});

module.exports = mongoose.model('Status', CreateGuildStat);