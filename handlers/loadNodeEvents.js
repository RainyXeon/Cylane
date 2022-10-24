const { readdirSync } = require('fs');

module.exports = async (client) => {
    readdirSync("./events/node/").forEach(file => {
        const event = require(`../events/node/${file}`);
        let eventName = file.split(".")[0];
        client.manager.shoukaku.on(eventName, event.bind(null, client));
      });
    client.logger.info('Node Events Loaded!');
}
