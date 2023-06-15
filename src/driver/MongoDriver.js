const { QuickDB, MongoDriver } = require("quick.db");

module.exports =  async (client, db_config) => {
  const mongoDriver = new MongoDriver(db_config.MONGO_DB);

  try {
    await mongoDriver.connect().then(async () => {
      client.logger.info('Connected to the database! [MONGO DB]')
      client.db = new QuickDB({ driver: mongoDriver });
    })
  } catch (err) {
    client.logger.log({ level: 'error', message: err })
  }
}