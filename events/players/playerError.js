const logger = require("../../plugins/logger");

module.exports = {
    run: async (client, player, type, error) => {
        logger.error(`Player get error ${error.message}`);
        const guild = client.guilds.cache.get(player.guild);
        if(!guild) return;
        await player.destroy(guild);
    }
};