module.exports = async (client, name, players, moved) => {
    if (moved) return; 
    if (client.used_lavalink != 0 && client.used_lavalink[0].name == name) return
    players.map(player => player.destroy())
    client.logger.warn(`Lavalink ${name}: Disconnected`);
    if (client.config.get.features.AUTOFIX_LAVALINK && !client.fixing_nodes) {
        client.fixing_nodes = true
        await require("../../plugins/autofix_lavalink")(client)
    }
};