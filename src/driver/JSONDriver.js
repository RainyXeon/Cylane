const { QuickDB, JSONDriver } = require("quick.db");

module.exports = async (client, db_config) => {
  const jsonDriver = new JSONDriver(
    db_config.JSON.path || "./cylane.database.json",
  );
  client.logger.info("Connected to the database! [LOCAL DATABASE/JSON]");
  client.db = new QuickDB({ driver: jsonDriver });
};
