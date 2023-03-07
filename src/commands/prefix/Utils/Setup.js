const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const Setup = require('../../../plugins/schemas/setup.js')

module.exports = { 
  name: "setup",
  description: "Setup channel song request",
  categories: "Utils",
  aliases: ["setup-channel"],
  usage: "<create or delete>",

run: async (client, message, args, language, prefix) => {
    let option = ["create", "delete"]
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send(`${client.i18n.get(language, "utilities", "lang_perm")}`);
    if (!args[0] || !option.includes(args[0])) return message.channel.send(`${client.i18n.get(language, "utilities", "arg_error", { text: "(create or delete)"})}`);

    const choose = args[0]
        
    if(choose === "create") {
        const parent = await message.guild.channels.create({
            name: `${client.user.username} Music Zone`,
            type: ChannelType.GuildCategory,
            parent_id: message.channel.parentId,
        })

        const textChannel = await message.guild.channels.create({
            name: "song-request",
            type: ChannelType.GuildText,
            topic: `${client.i18n.get(language, "setup", "setup_topic")}`,
            parent: parent.id,
            user_limit: 3,
            rate_limit_per_user: 3, 
        })
        const queueMsg = `${client.i18n.get(language, "setup", "setup_queuemsg")}`;

        const playEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${client.i18n.get(language, "setup", "setup_playembed_author")}` })
            .setImage(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.jpeg?size=300`)
            .setDescription(`${client.i18n.get(language, "setup", "setup_playembed_desc")}`)
            .setFooter({ text: `${client.i18n.get(language, "setup", "setup_playembed_footer")}` });

        const channel_msg = await textChannel.send({ content: `${queueMsg}`, embeds: [playEmbed], components: [client.diSwitch] })

        const voiceChannel = await message.guild.channels.create({
            name: `${client.user.username} Music`,
            type: ChannelType.GuildVoice,
            parent: parent.id,
            userLimit: 30,
        });

        await Setup.findOneAndUpdate({ guild: message.guild.id }, {
            guild: message.guild.id,
            enable: true,
            channel: textChannel.id,
            playmsg: channel_msg.id,
            voice: voiceChannel.id,
            category: parent.id
        }, { upsert: true, new: true });

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "setup", "setup_msg", {
                channel: textChannel,
            })}`)
            .setColor(client.color);
            return message.channel.send({ embeds: [embed] });
        }

        if(choose === "delete") {
            const SetupChannel = await Setup.findOne({ guild: message.guild.id });
            const fetchedTextChannel = message.guild.channels.cache.get(SetupChannel.channel)
            const fetchedVoiceChannel = message.guild.channels.cache.get(SetupChannel.voice)
            const fetchedCategory = message.guild.channels.cache.get(SetupChannel.category)

            const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "setup", "setup_deleted", {
                channel: fetchedTextChannel,
              })}`)
                .setColor(client.color);
            if (!SetupChannel) return message.channel.send({ embeds: [embed] });

            if (fetchedCategory) await fetchedCategory.delete()
            if (fetchedVoiceChannel) await fetchedVoiceChannel.delete()
            if (fetchedTextChannel) await fetchedTextChannel.delete();

            await Setup.findOneAndUpdate({ guild: message.guild.id }, {
                    guild: message.guild.id,
                    enable: false,
                    channel: "",
                    playmsg: "",
                    voice: "",
                    category: ""
                });

            return message.channel.send({ embeds: [embed] });
        }
    }
};