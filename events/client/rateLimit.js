const logger = require("../../plugins/logger");

module.exports = async (client, info) => {
    logger.error(`Rate Limited, Sleeping for ${0} seconds`);
}