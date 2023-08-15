const {
  ContextMenuInteraction,
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandType,
} = require("discord.js");
const { convertTime } = require("../../../structures/ConvertTime.js");
const { StartQueueDuration } = require("../../../structures/QueueDuration.js");
module.exports = {
  name: ["Play"],
  type: ApplicationCommandType.Message,
  category: "Context",
  /**
   * @param {ContextMenuInteraction} interaction
   */
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });

    const value =
      interaction.channel.messages.cache.get(interaction.targetId).content ??
      (await interaction.channel.messages.fetch(interaction.targetId));
    if (!value.startsWith("https"))
      return interaction.editReply(
        `${client.i18n.get(language, "music", "play_startwith")}`,
      );

    const msg = await interaction.editReply(
      `${client.i18n.get(language, "music", "play_loading", {
        result: value,
      })}`,
    );

    const { channel } = interaction.member.voice;
    if (!channel)
      return msg.edit(`${client.i18n.get(language, "music", "play_invoice")}`);
    if (
      !interaction.guild.members.cache
        .get(client.user.id)
        .permissions.has(PermissionsBitField.Flags.Connect)
    )
      return msg.edit(`${client.i18n.get(language, "music", "play_join")}`);
    if (
      !interaction.guild.members.cache
        .get(client.user.id)
        .permissions.has(PermissionsBitField.Flags.Speak)
    )
      return msg.edit(`${client.i18n.get(language, "music", "play_speak")}`);

    const player = await client.manager.createPlayer({
      guildId: interaction.guild.id,
      voiceId: interaction.member.voice.channel.id,
      textId: interaction.channel.id,
      deaf: true,
    });

    const result = await player.search(value, { requester: interaction.user });
    const tracks = result.tracks;

    const TotalDuration = StartQueueDuration(tracks);

    if (!result.tracks.length)
      return msg.edit({
        content: `${client.i18n.get(language, "music", "play_match")}`,
      });
    if (result.type === "PLAYLIST")
      for (let track of tracks) player.queue.add(track);
    else player.play(tracks[0]);

    if (result.type === "PLAYLIST") {
      const embed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "music", "play_playlist", {
            title: tracks[0].title,
            url: value,
            duration: convertTime(TotalDuration),
            songs: tracks.length,
            request: tracks[0].requester,
          })}`,
        )
        .setColor(client.color);
      msg.edit({ content: " ", embeds: [embed] });
      if (!player.playing) player.play();
    } else if (result.type === "TRACK") {
      const embed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "music", "play_track", {
            title: tracks[0].title,
            url: tracks[0].uri,
            duration: convertTime(tracks[0].length, true),
            request: tracks[0].requester,
          })}`,
        )
        .setColor(client.color);
      msg.edit({ content: " ", embeds: [embed] });
    } else if (result.type === "SEARCH") {
      const embed = new EmbedBuilder().setColor(client.color).setDescription(
        `${client.i18n.get(language, "music", "play_result", {
          title: tracks[0].title,
          url: tracks[0].uri,
          duration: convertTime(tracks[0].length, true),
          request: tracks[0].requester,
        })}`,
      );
      msg.edit({ content: " ", embeds: [embed] });
    }
  },
};
