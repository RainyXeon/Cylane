module.exports = async (client, name, error) => {
    client.logger.error(`Lavalink "${name}" error ${error}`);
};