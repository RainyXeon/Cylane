const mongoose = require('mongoose');
const database = require("../driver/index")

module.exports = async (client) => {
    try {
        const db_config = client.config.get.features.DATABASE

        function load_file() {
            require("./loader")(client)
        }

        if (db_config.JSON && db_config.JSON !== null) {
            await database.JSONDriver(client, db_config).then(() => {
                load_file()
            })
            return
        }

        if (db_config.MONGO_DB && db_config.MONGO_DB !== null) {
            await database.MongoDriver(client, db_config).then(() => {
                load_file()
            })
            return
        }

        if (db_config.MYSQL.enable && db_config.JSON == null && db_config.MONGO_DB == null) {
            await database.SQLDriver(client, db_config).then(() => {
                load_file()
            })
            return
        } else {
            await database.JSONDriver(client, db_config).then(() => {
                load_file()
            })
            return 
        }
    } catch (error) {
        return client.logger.log(error);
    }
} 