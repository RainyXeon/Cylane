module.exports = async (client) => {
  client.logger.info(`Logged in ${client.user.tag}`);

  // Auto Deploy
  require("../../plugins/autoDeploy.js")(client);

  let guilds = client.guilds.cache.size;
  let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
  let channels = client.channels.cache.size;

  const activities = [
    `with ${guilds} servers! | /music radio`,
    `with ${members} users! | /music play`,
    `with ${channels} users! | /filter nightcore`,
  ];

  setInterval(() => {
    client.user.setPresence({
      activities: [
        {
          name: `${activities[Math.floor(Math.random() * activities.length)]}`,
          type: 2,
        },
      ],
      status: "online",
    });
  }, 15000);
};
