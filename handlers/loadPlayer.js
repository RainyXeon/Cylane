const logger = require("../plugins/logger");

module.exports = (client) => {
    require("./Player/loadEvent.js")(client);
};