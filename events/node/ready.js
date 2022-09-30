const logger = require("../../plugins/logger");

module.exports = {
    run: async (client, name) => {
        logger.info(`Lavalink ${name} connected.`);
    }
};