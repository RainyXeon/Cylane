const { readdirSync } = require('fs');

module.exports = async (client) => {
  const events = readdirSync(`./src/websocket/`).filter(d => d.endsWith('.js'));
  for (let file of events) {
    const evt = require(`../websocket/${file}`);
    client.wss.message.set(evt.name, evt)
  }
  if (client.wss.message.size) {
    client.logger.info(`${client.wss.message.size} Websocket Request Loaded!`);
  } else {
    client.logger.warn(`No websocket request file loaded, is websocket ok?`);
  }
}