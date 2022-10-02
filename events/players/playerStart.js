const logger = require("../../plugins/logger");

module.exports = {
	/**
	 * 
	 * @param {Client} client 
	 * @param {*} player 
	 * @param {*} track 
	 */
	run: async (client, player, track) => {
		logger.info(`Player Started in @ ${player.guildId}`);
	}
};
