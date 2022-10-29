module.exports = async (client) => {
    client.logger.info(`Reconnected ${client.user.tag} (${client.user.id})`);
};
