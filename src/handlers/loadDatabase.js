module.exports = (client) => {
    require("./Database/loadDatabase.js")(client);
    require("./Database/loadPremium.js")(client)
    require("./Database/loadAvalible.js")(client)
    require("./Database/setupData.js")(client)
    client.logger.info('Database Events Loaded!');
};