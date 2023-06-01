const Premium = require("../../schemas/premium.js");
const Status = require('../../schemas/status.js')
const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField, ChannelType, version } = require('discord.js');
const ms = require('pretty-ms');
const { stripIndents } = require("common-tags");

module.exports = async (client) => {
    client.logger.info(`Logged in ${client.user.tag}`)

    // Auto Deploy
    require("../../plugins/autoDeploy.js")(client)
    const users = await Premium.find();
    users.forEach(user => client.premiums.set(user.Id, user))

    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    const activities = [
        `with ${guilds} servers! | /music radio`,
        `with ${members} users! | /music play`,
        `with ${channels} users! | /filter nightcore`
    ]

    // const lavainfo = client.manager.shoukaku.nodes.get('MAIN')
    // console.log(lavainfo.stats)

    const info = setInterval(async () => {
        const SetupChannel = await Status.find({ enable: true });
        if (!SetupChannel) return
        const fetched_info = new EmbedBuilder()
          .setTitle(client.user.tag + " Status")
          .addFields([
              { name: 'Uptime', value: `\`\`\`${ms(client.uptime)}\`\`\``, inline: true },
              { name: 'WebSocket Ping', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
              { name: 'Memory', value: `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, inline: true },
              { name: 'Guild Count', value: `\`\`\`${client.guilds.cache.size} guilds\`\`\``, inline: true },
              { name: 'User Count', value: `\`\`\`${client.users.cache.size} users\`\`\``, inline: true },
              { name: 'Node', value: `\`\`\`${process.version} on ${process.platform} ${process.arch}\`\`\``, inline: true },
              { name: 'Cached Data', value: `\`\`\`${client.users.cache.size} users\n${client.emojis.cache.size} emojis\`\`\``, inline: true },
              { name: 'Discord.js', value: `\`\`\`${version}\`\`\``, inline: true },
          ])
          .setTimestamp()
          .setColor(client.color);
    
          SetupChannel.forEach(async (g) => {
            const fetch_channel = await client.channels.fetch(g.channel)
            const interval_text = await fetch_channel.messages.fetch(g.statmsg)
            if (!fetch_channel) return
            await interval_text.edit({ content: ``, embeds: [fetched_info] })
          })
    
      }, 5000)

    client.interval.set("MAIN", info)

    setInterval(() => {
        client.user.setPresence({ 
            activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: 2 }], 
            status: 'online', 
        });
    }, 15000)
};