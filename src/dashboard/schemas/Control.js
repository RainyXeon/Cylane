const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const ControlSchema = new Schema({
  guild: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true,
	},
  playerControl: {
    type: mongoose.SchemaTypes.String,
    default: "disable",
    required: true,
  }
})

module.exports = mongoose.model('Controls', ControlSchema)