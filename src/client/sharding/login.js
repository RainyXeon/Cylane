const Manager = require("./manager.js");
const client = new Manager();

client.connect()
client.on("error", (err) => {
    client.logger.log({
      level: 'error',
      message: err
    })
});

process.on('unhandledRejection', error => client.logger.log({ level: 'error', message: error }));
process.on('uncaughtException', error => client.logger.log({ level: 'error', message: error }));

// client.manager.on("debug", (deb) => {
//   console.log(deb)
// })