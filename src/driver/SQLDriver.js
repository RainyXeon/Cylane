const { QuickDB, MySQLDriver } = require("quick.db");

module.exports = async (client, db_config) => {
  const config = db_config.MYSQL;

  const mysqlDriver = new MySQLDriver({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  try {
    await mysqlDriver.connect().then(async () => {
      client.logger.info("Connected to the database! [MYSQL]");
      client.db = new QuickDB({ driver: mysqlDriver });
    });
  } catch (error) {
    client.logger.log({ level: "error", message: error });
  }
};
