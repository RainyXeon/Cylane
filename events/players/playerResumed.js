const logger = require("../../plugins/logger");

module.exports = {
    run: async (client, player) => {
        logger.info(`Player Resume in @ ${player.guild}`);
    }
};