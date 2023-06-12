const mongoose = require('mongoose');
const { QuickDB, JSONDriver, MongoDriver } = require("quick.db");

module.exports = async (client) => {
    try {
        const db_config = client.config.get.features.DATABASE

        if (db_config.JSON && db_config.JSON !== null) {
            const jsonDriver = new JSONDriver(db_config.JSON || "./cylane.database.json");
            client.db = new QuickDB({ driver: jsonDriver });
            client.logger.info('Connected to the database! [LOCAL DATABASE/JSON]')
            return
        } 
        if (db_config.MONGO_DB && db_config.MONGO_DB !== null) {
            const mongoDriver = new MongoDriver(db_config.MONGO_DB);
            await mongoDriver.connect();
            client.db = new QuickDB({ driver: mongoDriver });
            client.logger.info('Connected to the database! [MONGO DB]')
            return
        }
        if (db_config.MYSQL.enable && db_config.JSON == null && db_config.MONGO_DB == null) {
            const config = db_config.MYSQL
    
            const mysqlDriver = new MySQLDriver({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
            });
        
            await mysqlDriver.connect();
        
            client.db = new QuickDB({ driver: mysqlDriver });
    
            client.logger.info('Connected to the database! [MYSQL]')
            return
        } else {
            const jsonDriver = new JSONDriver(client.config.get.features.LOCAL_DATABASE.path || "./cylane.database.json");
            client.db = new QuickDB({ driver: jsonDriver });
            client.logger.info('Connected to the database! [LOCAL DATABASE/JSON]')
            return
        }
    } catch (error) {
        client.logger.log(error);
    }
} 