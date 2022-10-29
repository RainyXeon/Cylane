module.exports = async (client, error, id) => {
    client.logger.warn(`Shard ${id} Shard Disconnected!`);
}