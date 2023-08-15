const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { convertTime } = require("../../../structures/ConvertTime.js");
const { StartQueueDuration } = require("../../../structures/QueueDuration.js");
const { stripIndents } = require("common-tags");
const humanizeDuration = require("humanize-duration");

let info;

module.exports = {
  name: "playlist-info",
  description: "Check the playlist infomation",
  category: "Playlist",
  usage: "<playlist_name_or_id>",
  aliases: ["pl-info"],

  run: async (client, message, args, language, prefix) => {
    const value = args[0] ? args[0] : null;
    const id = value ? null : args[0];

    if (id) info = await client.db.get(`playlist.pid_${id}`);
    if (value) {
      const Plist = value.replace(/_/g, " ");

      const fullList = await client.db.get("playlist");

      const pid = Object.keys(fullList).filter(function (key) {
        return (
          fullList[key].owner == message.author.id &&
          fullList[key].name == Plist
        );
      });

      info = fullList[pid[0]];
    }
    if (!id && !value)
      return message.channel.send(
        `${client.i18n.get(language, "playlist", "no_id_or_name")}`,
      );
    if (id && value)
      return message.channel.send(
        `${client.i18n.get(language, "playlist", "got_id_and_name")}`,
      );
    if (!info)
      return message.deferReply(
        `${client.i18n.get(language, "playlist", "invalid")}`,
      );
    if (info.private && info.owner !== message.author.id) {
      message.channel.send(
        `${client.i18n.get(language, "playlist", "import_private")}`,
      );
      return;
    }
    const created = humanizeDuration(Date.now() - info.created, { largest: 1 });

    const name = await client.users.fetch(info.owner);

    const embed = new EmbedBuilder()
      .setTitle(
        `${client.i18n.get(language, "playlist", "info_title", {
          name: info.name,
        })}`,
      )
      .addFields([
        {
          name: `${client.i18n.get(language, "playlist", "info_name")}`,
          value: `${info.name}`,
          inline: true,
        },
        {
          name: `${client.i18n.get(language, "playlist", "info_id")}`,
          value: `${info.id}`,
          inline: true,
        },
        {
          name: `${client.i18n.get(language, "playlist", "info_total")}`,
          value: `${info.tracks.length}`,
          inline: true,
        },
        {
          name: `${client.i18n.get(language, "playlist", "info_created")}`,
          value: `${created}`,
          inline: true,
        },
        {
          name: `${client.i18n.get(language, "playlist", "info_private")}`,
          value: `${
            info.private
              ? client.i18n.get(language, "playlist", "enabled")
              : client.i18n.get(language, "playlist", "disabled")
          }`,
          inline: true,
        },
        {
          name: `${client.i18n.get(language, "playlist", "info_owner")}`,
          value: `${name.username}`,
          inline: true,
        },
        {
          name: `${client.i18n.get(language, "playlist", "info_des")}`,
          value: `${
            info.description === null
              ? client.i18n.get(language, "playlist", "no_des")
              : info.description
          }`,
        },
      ])
      .setColor(client.color);
    message.channel.send({ embeds: [embed] });
  },
};
