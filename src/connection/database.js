const mongoose = require("mongoose");
const database = require("../driver/index");

module.exports = async (client) => {
  try {
    const db_config = client.config.features.DATABASE;

    function load_file() {
      require("./loader")(client);
    }

    if (
      db_config.JSON.enable &&
      !db_config.MYSQL.enable &&
      !db_config.MONGO_DB.enable
    ) {
      await database.JSONDriver(client, db_config).then(async () => {
        await load_file();
      });
      return;
    }

    if (
      db_config.MONGO_DB.enable &&
      !db_config.JSON.enable &&
      !db_config.MYSQL.enable
    ) {
      await database.MongoDriver(client, db_config).then(async () => {
        await load_file();
      });
      return;
    }

    if (
      db_config.MYSQL.enable &&
      !db_config.JSON.enable &&
      !db_config.MONGO_DB.enable
    ) {
      await database.SQLDriver(client, db_config).then(async () => {
        await load_file();
      });
      return;
    } else {
      await database.JSONDriver(client, db_config).then(async () => {
        await load_file();
      });
      return;
    }
  } catch (error) {
    return client.logger.log(error);
  }
};
