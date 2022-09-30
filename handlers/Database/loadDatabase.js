const mongoose = require('mongoose');
const { MONGO_URI } = require('../../plugins/config.js');

module.exports = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error);
    }
} 