const logger = require("../../plugins/logger");

module.exports = async (client, id) => {
    logger.info(`Shard ${id} Ready!`);
}