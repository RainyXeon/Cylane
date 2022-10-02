const logger = require("../../plugins/logger");

module.exports = {
  run: async (client, player) => {
    logger.info(`Player Empty in @ ${player.guildId}`);
    await player.destroy()
  },
};
