module.exports = async (client, name, players, moved) => {
    if (moved) return; 
    if (client.used_lavalink != 0 && client.used_lavalink[0].name == name) return
    players.map(player => player.destroy())
    client.logger.debug(`Lavalink ${name}: Disconnected`);
    if (client.config.features.AUTOFIX_LAVALINK && !client.fixing_nodes) {
        client.fixing_nodes = true
        await require("../../lava_scrap/autofix_lavalink")(client)
    }
};