module.exports = async (client, player, track, message) => {
  client.logger.error(`Player resoled error: ${message}`);
  const guild = client.guilds.cache.get(player.guildId);
  const channel = client.channels.cache.get(player.textChannel);
  if (!channel && !guild) return;
  await client.UpdateMusic(player);
  await player.destroy(guild);
};