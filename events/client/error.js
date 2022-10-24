module.exports = async (client) => {
    client.logger.error(`Errored ${client.user.tag} (${client.user.id})`);
};
