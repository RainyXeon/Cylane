const logger = require("../../plugins/logger");

module.exports = async (client) => {
    logger.info(`Logged in ${client.user.tag}`)

    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    const activities = [
        `with ${guilds} servers! | /music radio`,
        `with ${members} users! | /music play`,
        `with ${channels} users! | /filter nightcore`
    ]

    setInterval(() => {
        client.user.setActivity(`${activities[Math.floor(Math.random() * activities.length)]}`, { type: "STREAMING", url: "https://www.twitch.tv/lofichillnight" });
    }, 60000)
};
