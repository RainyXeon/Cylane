const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { convertTime } = require("../../../structures/ConvertTime.js");

let OriginalQueueLength;

// Main code
module.exports = {
  name: ["remove-duplicate"],
  description: "Remove duplicated song from queue",
  category: "Music",
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

    OriginalQueueLength = player.queue.length;

    for (let i = 0; i < player.queue.length; i++) {
      const element = player.queue[i];
      if (player.queue.current.uri == element.uri) {
        player.queue.splice(player.queue.indexOf(player.queue.current.uri), 1);
      }
    }

    const unique = [...new Map(player.queue.map((m) => [m.uri, m])).values()];

    player.queue.clear();
    player.queue.push(...unique);

    const embed = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(language, "music", "removetrack_duplicate_desc", {
          original: OriginalQueueLength,
          new: unique.length,
          removed: OriginalQueueLength - unique.length,
        })}`,
      )
      .setColor(client.color);

    await interaction.editReply({ embeds: [embed] });

    OriginalQueueLength = null;
    return;
  },
};
