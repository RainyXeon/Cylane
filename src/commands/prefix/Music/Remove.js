const { EmbedBuilder } = require("discord.js");
const { convertTime } = require("../../../structures/ConvertTime.js");

// Main code
module.exports = {
  name: "remove",
  description: "Remove song from queue.",
  category: "Music",
  usage: "<position>",
  aliases: ["rm"],

  run: async (client, message, args, language, prefix) => {
    const msg = await message.channel.send(
      `${client.i18n.get(language, "music", "pause_loading")}`,
    );
    const player = client.manager.players.get(message.guild.id);

    if (!player)
      return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
    const { channel } = message.member.voice;

    if (
      !channel ||
      message.member.voice.channel !== message.guild.members.me.voice.channel
    )
      return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

    const tracks = args[0];
    if (tracks == 0)
      return msg.edit(
        `${client.i18n.get(language, "music", "removetrack_already")}`,
      );
    if (tracks > player.queue.length)
      return msg.edit(
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

    return msg.edit({ embeds: [embed] });
  },
};
