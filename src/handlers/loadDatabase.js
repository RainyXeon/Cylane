module.exports = (client) => {
    require("./Database/loadDatabase.js")(client);
    require("./Database/loadPremium.js")(client)
    client.logger.info('Database Events Loaded!');
};