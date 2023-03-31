const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const SetupSchema = new Schema({
  guild: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  enable: mongoose.SchemaTypes.Boolean,
  channel: mongoose.SchemaTypes.String,
  playmsg: mongoose.SchemaTypes.String,
  queuemsg: mongoose.SchemaTypes.String,
})

module.exports = mongoose.model('Setups', SetupSchema)