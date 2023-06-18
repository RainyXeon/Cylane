module.exports = async (client, name, error) => {
    if (client.used_lavalink != 0 && client.used_lavalink[0].name == name) return
    client.logger.error(`Lavalink "${name}" error ${error}`);
    if (client.config.get.features.AUTOFIX_LAVALINK && !client.fixing_nodes) {
        client.fixing_nodes = true
        await require("../../plugins/autofix_lavalink")(client)
    }
};