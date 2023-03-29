"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const CreateControl = mongoose.Schema({
    language: { type: Array }
});
exports.default = mongoose.model('Avalible', CreateControl);
