const logger = require("../../plugins/logger");

module.exports = async (client) => {
    logger.error(`Errored ${client.user.tag} (${client.user.id})`);
};
