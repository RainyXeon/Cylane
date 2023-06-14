const { QuickDB, MongoDriver } = require("quick.db");

module.exports =  async (client, db_config) => {
  const mongoDriver = new MongoDriver(db_config.MONGO_DB);

  function load_file() {
    client.db = new QuickDB({ driver: mongoDriver });
    require("../loader")(client)
  }

  try {
    await mongoDriver.connect().then(async () => {
      client.logger.info('Connected to the database! [MONGO DB]')
      load_file()
    })
  } catch (err) {
    client.logger.log({ level: 'error', message: err })
  }
  


  return
}