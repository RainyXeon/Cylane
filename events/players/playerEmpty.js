module.exports = async (client, player) => {
  client.logger.info(`Player Empty in @ ${player.guildId}`);
  await player.destroy()
};
