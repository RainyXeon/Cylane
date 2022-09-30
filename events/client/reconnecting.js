const logger = require("../../plugins/logger");

module.exports = async (client) => {
    logger.info(`Reconnected ${client.user.tag} (${client.user.id})`);
};
