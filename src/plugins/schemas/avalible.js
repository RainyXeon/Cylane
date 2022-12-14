const mongoose = require('mongoose');

const CreateControl = mongoose.Schema({
  language: { type: Array }
});

module.exports = mongoose.model('Avalible', CreateControl);