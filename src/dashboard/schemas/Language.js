const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const LangSchema = new Schema({
  guild: {
		type: mongoose.SchemaTypes.String,
		required: true,
		unique: true,
	},
  language: {
    type: mongoose.SchemaTypes.String,
    default: "en",
    required: true,
  }
})

module.exports = mongoose.model('Languages', LangSchema)