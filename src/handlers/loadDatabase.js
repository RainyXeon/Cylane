module.exports = (client) => {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    require(`./Database/loadDatabase`)(client)

    wait(3 * 1000).then(() => {
        require("./Database/loadPremium.js")(client)
        require("./Database/loadAvalible.js")(client)
        require("./Database/setupData.js")(client)
    }).catch(() => {
        this.logger.log({ level: 'error', message: error })
    });

    client.logger.info('Database Events Loaded!');
};