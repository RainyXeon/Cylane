module.exports = async (client, player, data) => {
    client.logger.error(`Player get exception ${data}`);
    const guild = client.guilds.cache.get(player.guildId);
    if(!guild) return;
    await player.destroy(guild);
    if (client.websocket) client.websocket.send(JSON.stringify({ player_status: 0, guild: player.guildId }))
};