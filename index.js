const MainClient = require("./manager.js");
const client = new MainClient();

client.connect()
client.on("error", (err) => {
    client.logger.log({
      level: 'error',
      message: err
    })
});