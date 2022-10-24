module.exports = async (client, name, players, moved) => {
    if (moved) return; 
    players.map(player => player.connection.disconnect())
    client.logger.warn(`Lavalink ${name}: Disconnected`);
};