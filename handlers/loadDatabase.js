const logger = require("../plugins/logger");

module.exports = (client) => {
    require("./Database/loadDatabase.js")(client);
    logger.info('Database Events Loaded!');
};