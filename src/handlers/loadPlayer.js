const logger = require("../plugins/logger");

module.exports = (client) => {
    require("./Player/loadEvent.js")(client);
    require("./Player/loadContent.js")(client);
    require("./Player/loadSetup.js")(client);
    require("./Player/loadUpdate.js")(client);
    client.logger.info('Shoukaku Player Events Loaded!');
};