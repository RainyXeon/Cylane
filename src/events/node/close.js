module.exports = async (client, name, code, reason) => {
    if (client.used_lavalink != 0 && client.used_lavalink[0].name == name) return
    client.logger.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`);
    if (client.config.get.features.AUTOFIX_LAVALINK && !client.fixing_nodes) {
        client.fixing_nodes = true
        await require("../../plugins/autofix_lavalink")(client)
    }
};