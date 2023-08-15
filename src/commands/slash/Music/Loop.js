const {
  EmbedBuilder,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: ["loop"],
  description: "Loop song in queue type all/current!",
  category: "Music",
  options: [
    {
      name: "type",
      description: "Type of loop",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Current",
          value: "current",
        },
        {
          name: "Queue",
          value: "queue",
        },
      ],
    },
  ],
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });
    const msg = await interaction.editReply(
      `${client.i18n.get(language, "music", "loop_loading")}`,
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

    const mode = interaction.options.get("type").value;

    const loop_mode = {
      none: "none",
      track: "track",
      queue: "queue",
    };

    if (mode == "current") {
      if (player.loop === "none") {
        await player.setLoop(loop_mode.track);
        const looped = new EmbedBuilder()
          .setDescription(
            `${client.i18n.get(language, "music", "loop_current")}`,
          )
          .setColor(client.color);
        msg.edit({ content: " ", embeds: [looped] });
      } else if (player.loop === "track") {
        await player.setLoop(loop_mode.none);
        const looped = new EmbedBuilder()
          .setDescription(
            `${client.i18n.get(language, "music", "unloop_current")}`,
          )
          .setColor(client.color);
        msg.edit({ content: " ", embeds: [looped] });
      }
    } else if (mode == "queue") {
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
    }
  },
};
