const mongoose = require('mongoose');
const { MONGO_URI } = require('../../plugins/config.js');

module.exports = async (client) => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false
        });
        client.logger.info('Connected to the database!')
    } catch (error) {
        client.logger.log({
            level: 'error',
            message: error
        });
    }
} 