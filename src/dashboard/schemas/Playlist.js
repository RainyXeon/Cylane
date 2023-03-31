const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const PlaylistSchema = new Schema({
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
    },
  name: mongoose.SchemaTypes.String,
  tracks: mongoose.SchemaTypes.Array,
  created: mongoose.SchemaTypes.Number,
  private: mongoose.SchemaTypes.Boolean,
  owner: mongoose.SchemaTypes.String,
  description: mongoose.SchemaTypes.String
})

module.exports = mongoose.model('Playlists', PlaylistSchema)