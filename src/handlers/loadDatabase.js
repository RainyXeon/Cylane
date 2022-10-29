module.exports = (client) => {
    require("./Database/loadDatabase.js")(client);
    client.logger.info('Database Events Loaded!');
};