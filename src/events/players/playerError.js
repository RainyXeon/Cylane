module.exports = async (client, player, type, error) => {
    client.logger.error(`Player get error ${error.message}`);
    const guild = client.guilds.cache.get(player.guildId);
    if(!guild) return;
    await player.destroy(guild);
};