const mongoose = require('mongoose');
const { MONGO_URI } = require('../../plugins/config.js');
const { QuickDB, JSONDriver, MongoDriver } = require("quick.db");

module.exports = async (client) => {

    if (client.config.get.features.LOCAL_DATABASE.enable) {
        const jsonDriver = new JSONDriver(client.config.get.features.LOCAL_DATABASE.path || "./cylane.database.json");
        client.db = new QuickDB({ driver: jsonDriver });
        client.logger.info('Connected to the database!')
        return
    } else {
        const mongoDriver = new MongoDriver(MONGO_URI);
        await mongoDriver.connect();
        client.db = new QuickDB({ driver: mongoDriver });
        client.logger.info('Connected to the database!')
        return

    }
} 