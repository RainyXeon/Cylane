const CylaneClient = require("./cylane.js");
const client = new CylaneClient();

client.connect()
client.on("error", (err) => {
    client.logger.log({
      level: 'error',
      message: err
    })
});
client.manager.on("debug", (deb) => {
  console.log(deb)
})