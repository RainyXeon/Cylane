const { EmbedBuilder, PermissionsBitField, ChannelType, version } = require('discord.js');
const ms = require('pretty-ms');

module.exports = { 
  name: "status-channel",
  description: "Create bot status channel",
  category: "Utils",
  aliases: ["sc"],
  usage: "<create or delete>",

run: async (client, message, args, language, prefix) => {

    let option = ["create", "delete"]
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send(`${client.i18n.get(language, "utilities", "lang_perm")}`);
    if (!args[0] || !option.includes(args[0])) return message.channel.send(`${client.i18n.get(language, "utilities", "arg_error", { text: "(create or delete)"})}`);

    const choose = args[0]
        
    if(choose === "create") {

        const parent = await message.guild.channels.create({
            name: `${client.user.username} Status`,
            type: ChannelType.GuildCategory,
            parent_id: message.channel.parentId,
        })

        const textChannel = await message.guild.channels.create({
            name: "bot-status",
            type: ChannelType.GuildText,
            parent: parent.id,
            user_limit: 3,
            rate_limit_per_user: 3, 
        })

        const info = new EmbedBuilder()
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
        const channel_msg = await textChannel.send({ content: ``, embeds: [info] })

        const new_data = {
            guild: message.guild.id,
            enable: true,
            channel: textChannel.id,
            statmsg: channel_msg.id,
            category: parent.id
        }

        await client.db.set(`setup.guild_${message.guild.id}`, new_data)

        const interval_info = await client.interval.get("MAIN")

        if (!interval_info) {
            const interval_online = setInterval(async () => {
                const SetupChannel = await client.db.get(`setup.guild_${message.guild.id}`)
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

            await client.interval.set("MAIN", interval_online)
        }

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "setup", "setup_msg", {
                channel: textChannel,
            })}`)
            .setColor(client.color);
            return message.channel.send({ embeds: [embed] });
        }

        if(choose === "delete") {
            const SetupChannel = await client.db.get(`setup.guild_${message.guild.id}`)

            const embed_none = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "setup", "setup_deleted", {
                channel: undefined,
              })}`)
              .setColor(client.color);

            if (!SetupChannel) return message.channel.send({ embeds: [embed_none] });

            const fetchedTextChannel = message.guild.channels.cache.get(SetupChannel.channel)
            const fetchedCategory = message.guild.channels.cache.get(SetupChannel.category)

            const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "setup", "setup_deleted", {
              channel: fetchedTextChannel,
            })}`)
            .setColor(client.color);
            await message.channel.send({ embeds: [embed] });

            if (fetchedTextChannel) await fetchedTextChannel.delete();
            if (fetchedCategory) await fetchedCategory.delete()

            const deleted_data = {
                guild: message.guild.id,
                enable: false,
                channel: "",
                statmsg: "",
                category: ""
            }

            return client.db.set(`setup.guild_${message.guild.id}`, deleted_data)
        }
    }
};
