const { readdirSync } = require('fs');
const logger = require("../../plugins/logger");

module.exports = async (client) => {
  process.setMaxListeners(0);
    readdirSync("./events/players/").forEach(file => {
        const event = require(`../../events/players/${file}`);
        let eventName = file.split(".")[0];
        client.manager.on(event.name, (...args) => event.run(this, ...args));
      });
    logger.info('Shoukaku Player Events Loaded!');
}