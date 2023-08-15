module.exports = async (client, player, data) => {
  client.logger.error(`Player get exception ${data}`);
  const guild = client.guilds.cache.get(player.guildId);
  if (!guild) return;
  await player.destroy(guild);
  if (client.websocket)
    client.websocket.send(
      JSON.stringify({ op: "player_destroy", guild: player.guildId }),
    );
};
