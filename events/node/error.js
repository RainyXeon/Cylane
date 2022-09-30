const logger = require("../../plugins/logger");

module.exports = {
    run: async (client, name, error) => {
        logger.error(`Lavalink "${name}" error ${error}`);
    }
};