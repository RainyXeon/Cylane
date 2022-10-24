module.exports = async (client) => {
    client.logger.warn(`Warned ${client.user.tag} (${client.user.id})`);
};
