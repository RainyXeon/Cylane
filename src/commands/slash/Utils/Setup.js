const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField, ChannelType } = require('discord.js');
const Setup = require('../../../plugins/schemas/setup.js')
module.exports = { 
  name: ["settings", "setup"],
  description: "Setup channel song request",
  categories: "Utils",
  options: [
      {
          name: "type",
          description: "Type of channel",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
              {
                  name: "Create",
                  value: "create"
              },
              {
                  name: "Delete",
                  value: "delete"
              }
          ]
      },
  ],
run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
            if(interaction.options.getString('type') === "create") {
                const parent = await interaction.guild.channels.create({
                    name: `${client.user.username} Music Zone`,
                    type: ChannelType.GuildCategory,
                    parent_id: interaction.channel.parentId,
                })
                const textChannel = await interaction.guild.channels.create({
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

                const voiceChannel = await interaction.guild.channels.create({
                    name: `${client.user.username} Music`,
                    type: ChannelType.GuildVoice,
                    parent: parent.id,
                    userLimit: 30,
                });

                await Setup.findOneAndUpdate({ guild: interaction.guild.id }, {
                    guild: interaction.guild.id,
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
                    return interaction.followUp({ embeds: [embed] });
                }

                if(interaction.options.getString('type') === "delete") {
                    const SetupChannel = await Setup.findOne({ guild: interaction.guild.id });

                    const fetchedTextChannel = interaction.guild.channels.cache.get(SetupChannel.channel)
                    const fetchedVoiceChannel = interaction.guild.channels.cache.get(SetupChannel.voice)
                    const fetchedCategory = interaction.guild.channels.cache.get(SetupChannel.category)

                    const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "setup", "setup_deleted", {
                        channel: fetchedTextChannel,
                      })}`)
                        .setColor(client.color);

                    if (!SetupChannel) return interaction.editReply({ embeds: [embed] });

                    if (fetchedCategory) await fetchedCategory.delete()
                    if (fetchedVoiceChannel) await fetchedVoiceChannel.delete()
                    if (fetchedTextChannel) await fetchedTextChannel.delete();

                    await Setup.findOneAndUpdate({ guild: interaction.guild.id }, {
                            guild: interaction.guild.id,
                            enable: false,
                            channel: "",
                            playmsg: "",
                            voice: "",
                            category: ""
                        });

                    return interaction.editReply({ embeds: [embed] });
        }
    }
};