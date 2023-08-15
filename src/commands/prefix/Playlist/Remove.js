const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "playlist-remove",
  description: "Remove a song from a playlist",
  category: "Playlist",
  usage: "<playlist_name> <song_postion>",
  aliases: ["pl-remove"],

  run: async (client, message, args, language, prefix) => {
    const value = args[0] ? args[0] : null;
    const pos = args[1];

    if (pos && isNaN(pos))
      return message.channel.send(
        `${client.i18n.get(language, "music", "number_invalid")}`,
      );

    const Plist = value.replace(/_/g, " ");
    const fullList = await client.db.get("playlist");

    const pid = Object.keys(fullList).filter(function (key) {
      return (
        fullList[key].owner == message.author.id && fullList[key].name == Plist
      );
    });

    const playlist = fullList[pid[0]];
    if (!playlist)
      return message.channel.send(
        `${client.i18n.get(language, "playlist", "remove_notfound")}`,
      );
    if (playlist.owner !== message.author.id)
      return message.channel.send(
        `${client.i18n.get(language, "playlist", "remove_owner")}`,
      );

    const position = pos;
    const song = playlist.tracks[position - 1];
    if (!song)
      return message.channel.send(
        `${client.i18n.get(language, "playlist", "remove_song_notfound")}`,
      );
    await client.db.pull(
      `playlist.${pid[0]}.tracks`,
      playlist.tracks[position - 1],
    );
    const embed = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(language, "playlist", "remove_removed", {
          name: Plist,
          position: pos,
        })}`,
      )
      .setColor(client.color);
    message.channel.send({ embeds: [embed] });
  },
};
