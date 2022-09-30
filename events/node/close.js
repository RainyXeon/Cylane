const logger = require("../../plugins/logger");
module.exports = {
    run: async (client, name, code, reason) => {
        logger.error(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`);
    }
};