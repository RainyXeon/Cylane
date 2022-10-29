module.exports = async (client, player, reason) => {
    client.logger.error(`Player Get exception ${reason}`);
    const guild = client.guilds.cache.get(player.guildId);
    if(!guild) return;
    await player.destroy(guild);
};