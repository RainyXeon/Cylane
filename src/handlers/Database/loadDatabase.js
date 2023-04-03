const mongoose = require('mongoose');
const { MONGO_URI } = require('../../plugins/config.js');

module.exports = async (client) => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        client.logger.info('Connected to the database!')
    } catch (error) {
        client.logger.log({
            level: 'error',
            message: error
        });
    }
} 