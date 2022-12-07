module.exports = async (client, player) => {
    const guild = await client.guilds.cache.get(player.guildId)
    client.logger.info(`Player Resumed in @ ${guild.name} / ${player.guildId}`);
};