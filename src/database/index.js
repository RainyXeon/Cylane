const MongoDriver = require("./driver/MongoDriver");
const JSONDriver = require("./driver/JSONDriver");
const SQLDriver = require("./driver/SQLDriver");

module.exports = async (client) => {
  try {
    const db_config = client.config.features.DATABASE;

    function load_file() {
      client.is_db_connected = true;
      require("./handler")(client);
    }

    if (
      db_config.JSON.enable &&
      !db_config.MYSQL.enable &&
      !db_config.MONGO_DB.enable
    ) {
      await JSONDriver(client, db_config).then(() => {
        load_file();
      });
      return;
    }

    if (
      db_config.MONGO_DB.enable &&
      !db_config.JSON.enable &&
      !db_config.MYSQL.enable
    ) {
      await MongoDriver(client, db_config).then(() => {
        load_file();
      });
      return;
    }

    if (
      db_config.MYSQL.enable &&
      !db_config.JSON.enable &&
      !db_config.MONGO_DB.enable
    ) {
      await SQLDriver(client, db_config).then(() => {
        load_file();
      });
      return;
    } else {
      await JSONDriver(client, db_config).then(() => {
        load_file();
      });
      return;
    }
  } catch (error) {
    return client.logger.log(error);
  }
};
