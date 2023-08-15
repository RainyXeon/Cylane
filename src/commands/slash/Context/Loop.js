const {
  ContextMenuInteraction,
  EmbedBuilder,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  name: ["Loop"],
  type: ApplicationCommandType.Message,
  category: "Context",
  /**
   * @param {ContextMenuInteraction} interaction
   */
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });
    const msg = await interaction.editReply(
      `${client.i18n.get(language, "music", "loopall_loading")}`,
    );

    const player = client.manager.players.get(interaction.guild.id);
    if (!player)
      return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
    const { channel } = interaction.member.voice;
    if (
      !channel ||
      interaction.member.voice.channel !==
        interaction.guild.members.me.voice.channel
    )
      return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

    const loop_mode = {
      none: "none",
      track: "track",
      queue: "queue",
    };

    if (player.loop === "none") {
      await player.setLoop(loop_mode.queue);
      const looped_queue = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "loop_all")}`)
        .setColor(client.color);
      msg.edit({ content: " ", embeds: [looped_queue] });
    } else if (player.loop === "queue") {
      await player.setLoop(loop_mode.none);
      const looped = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "unloop_all")}`)
        .setColor(client.color);
      msg.edit({ content: " ", embeds: [looped] });
    }
  },
};
