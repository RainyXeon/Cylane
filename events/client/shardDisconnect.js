const logger = require("../../plugins/logger");

module.exports = async (client, error, id) => {
    logger.info(`Shard ${id} Shard Disconnected!`);
}