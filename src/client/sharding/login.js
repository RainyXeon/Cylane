const Manager = require("./manager.js");
const client = new Manager();

client.connect()
client.on("error", (err) => {
    client.logger.log({
      level: 'error',
      message: err
    })
});

// client.manager.on("debug", (deb) => {
//   console.log(deb)
// })