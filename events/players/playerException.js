const logger = require("../../plugins/logger");

module.exports = {
    run: async (client, player, reason) => {
        logger.error(`Player Get exception ${reason}`);
        const guild = client.guilds.cache.get(player.guild);
        if(!guild) return;
        await player.destroy(guild);
    }
};