const mongoose = require('mongoose');

const CreatePlaylist = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        },
    name: String,
    tracks: Array,
    created: Number,
    private: Boolean,
    owner: String,
    description: String
});

module.exports = mongoose.model('Playlist', CreatePlaylist);