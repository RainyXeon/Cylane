const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const UserSchema = new Schema({
  discordId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  accessToken: { type: mongoose.SchemaTypes.String, required: true },
  refreshToken: { type: mongoose.SchemaTypes.String, required: true },
  schemasId: { type: mongoose.SchemaTypes.String, required: true },
  token: { 
    type: mongoose.SchemaTypes.String, 
    required: true,
    unique: true,
  },
  expires: { 
    type: mongoose.SchemaTypes.Number, 
    required: true,
  }
})

module.exports = mongoose.model('token', UserSchema)