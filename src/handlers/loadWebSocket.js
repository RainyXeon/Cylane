const { readdirSync } = require('fs');

module.exports = async (client) => {
  const events = readdirSync(`./src/events/websocket/`).filter(d => d.endsWith('.js'));
  for (let file of events) {
    const evt = require(`../events/websocket/${file}`);
    const eName = file.split('.')[0];
    client.wss.on(eName, (ws) => evt.run(client, ws));
  }
}