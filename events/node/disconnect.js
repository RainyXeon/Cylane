const logger = require("../../plugins/logger");

module.exports = {
    run: async (client, name, players, moved) => {
        if (moved) return; 
        players.map(player => player.connection.disconnect())
        logger.warn(`Lavalink ${name}: Disconnected`);
    }
};