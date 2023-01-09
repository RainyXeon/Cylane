module.exports = async (client, player) => {
    const guild = await client.guilds.cache.get(player.guildId)
    client.logger.info(`Player Created in @ ${guild.name} / ${player.guildId}`);
    if (client.websocket) client.websocket.send(JSON.stringify({ op: "player_create", guild: player.guildId }))
};