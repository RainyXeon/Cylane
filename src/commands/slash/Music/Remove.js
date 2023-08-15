const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { convertTime } = require("../../../structures/ConvertTime.js");

// Main code
module.exports = {
  name: ["remove"],
  description: "Remove song from queue",
  category: "Music",
  options: [
    {
      name: "position",
      description: "The position in queue want to remove.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });

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

    const tracks = interaction.options.getInteger("position");
    if (tracks == 0)
      return interaction.editReply(
        `${client.i18n.get(language, "music", "removetrack_already")}`,
      );
    if (tracks > player.queue.length)
      return interaction.editReply(
        `${client.i18n.get(language, "music", "removetrack_notfound")}`,
      );

    const song = player.queue[tracks - 1];

    player.queue.splice(tracks - 1, 1);

    const embed = new EmbedBuilder().setDescription(
      `${client.i18n
        .get(language, "music", "removetrack_desc", {
          name: song.title,
          url: song.uri,
          duration: convertTime(song.duration, true),
          request: song.requester,
        })
        .setColor(client.color)}`,
    );

    return interaction.editReply({ embeds: [embed] });
  },
};
