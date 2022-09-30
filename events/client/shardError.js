const logger = require("../../plugins/logger");

module.exports = async (client, error, id) => {
    logger.error(`Shard ${id} Errored!`);
}