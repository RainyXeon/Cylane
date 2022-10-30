const { readdirSync } = require('fs');

module.exports = async (client) => {
    readdirSync("./src/events/players/").forEach(file => {
      const event = require(`../../events/players/${file}`);
      let eventName = file.split(".")[0];
      client.manager.on(eventName, event.bind(null, client));
    });
}