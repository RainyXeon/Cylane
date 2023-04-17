module.exports = async (client, name, players, moved) => {
    if (moved) return; 
    players.map(player => player.destroy())
    if (client.count !== 0) {
        client.count + 1
        client.logger.warn(`Lavalink ${name}: Disconnected`);
    }
    
};