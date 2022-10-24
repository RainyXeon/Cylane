module.exports = async (client) => {
    client.logger.info(`Disconnected ${client.user.tag} (${client.user.id})`);
};
