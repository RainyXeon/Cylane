const { readdirSync } = require("fs");

module.exports = async (client) => {
  readdirSync("./src/events/websocket/").forEach((file) => {
    const event = require(`../events/websocket/${file}`);
    let eventName = file.split(".")[0];
    client.wss.on(eventName, event.bind(null, client));
  });
  client.logger.info(`Websocket Event Loaded!`);
};
