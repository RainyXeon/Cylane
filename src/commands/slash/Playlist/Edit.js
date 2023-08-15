const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { convertTime } = require("../../../structures/ConvertTime.js");
const { StartQueueDuration } = require("../../../structures/QueueDuration.js");
const { stripIndents } = require("common-tags");
const humanizeDuration = require("humanize-duration");
const remove_regex = /[^0] - [^0]/;
const TrackAdd = [];

module.exports = {
  name: ["playlist", "edit"],
  description: "Edit the playlist infomation",
  category: "Playlist",
  options: [
    {
      name: "name",
      description: "The name of the playlist",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "rename",
      description: "The new name of the playlist",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "description",
      description: "The description of the playlist",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "private",
      description: "The private mode of the playlist",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Enable",
          value: "enable",
        },
        {
          name: "Disable",
          value: "disable",
        },
      ],
    },
    {
      name: "add",
      description: "Search and add track to the playlist",
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
    },
    {
      name: "remove",
      description: "Remove track using song position.",
      type: ApplicationCommandOptionType.Number,
    },
  ],
  run: async (interaction, client, language) => {
    const name = interaction.options.getString("name");
    const PlaylistName = name.replace(/_/g, " ");
    const newname = interaction.options.getString("rename")
      ? interaction.options.getString("rename")
      : null;
    const des = interaction.options.getString("description")
      ? interaction.options.getString("description")
      : null;
    const get_private = interaction.options.getString("private")
      ? interaction.options.getString("private")
      : null;
    const add = interaction.options.getString("add")
      ? interaction.options.getString("add")
      : null;
    const remove = interaction.options.getNumber("remove")
      ? interaction.options.getNumber("remove")
      : null;
    const fullList = await client.db.get("playlist");
    const pid = Object.keys(fullList).filter(function (key) {
      return (
        fullList[key].owner == interaction.user.id &&
        fullList[key].name == PlaylistName
      );
    });
    const playlist = fullList[pid[0]];

    function parseBoolean(value) {
      if (typeof value === "string") {
        value = value.trim().toLowerCase();
      }
      switch (value) {
        case "enable":
          return true;
        case "disable":
          return false;
        case null:
          return null;
      }
    }

    function parseReply(value) {
      if (value) return client.i18n.get(language, "playlist", "enabled");
      return client.i18n.get(language, "playlist", "disabled");
    }

    const private = parseBoolean(get_private);

    async function RunCommands(newname, des, private, add, remove, playlist) {
      try {
        await interaction.deferReply({ ephemeral: false });
        if (!playlist)
          return interaction.editReply(
            `${client.i18n.get(language, "playlist", "public_notfound")}`,
          );
        const embed = new EmbedBuilder()
          .setTitle(`${client.i18n.get(language, "playlist", "edit_new")}`)
          .setDescription(
            stripIndents`${client.i18n.get(
              language,
              "playlist",
              "edit_name",
            )} \`${newname !== null ? newname : name}\`
            ${client.i18n.get(language, "playlist", "edit_des")} \`${
              des !== null ? des : playlist.description
            }\`
            ${client.i18n.get(language, "playlist", "edit_private")} \`${
              private !== null
                ? parseReply(private)
                : parseReply(playlist.private)
            }\`
            ${client.i18n.get(language, "playlist", "edit_added")} \`${
              add !== null
                ? add
                : client.i18n.get(language, "playlist", "edit_added_none")
            }\`
            ${client.i18n.get(language, "playlist", "edit_removed")} \`${
              remove !== null
                ? remove
                : client.i18n.get(language, "playlist", "edit_removed_none")
            }\` `,
          )
          .setColor(client.color);
        const row = new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setCustomId("yes")
            .setEmoji("✔️")
            .setLabel(
              `${client.i18n.get(language, "playlist", "edit_button_yes")}`,
            )
            .setStyle("Success"),

          new ButtonBuilder()
            .setCustomId("no")
            .setEmoji("✖️")
            .setLabel(
              `${client.i18n.get(language, "playlist", "edit_button_no")}`,
            )
            .setStyle("Danger"),
        ]);
        const msg = await interaction.editReply({
          embeds: [embed],
          components: [row],
          ephemeral: true,
        });
        const collector = msg.createMessageComponentCollector({ time: 15000 });
        collector.on("collect", async (message) => {
          const col_id = message.customId;
          if (col_id == "no") {
            const embed = new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `${client.i18n.get(language, "playlist", "edit_canceled")}`,
              );
            await message.reply({ embeds: [embed] });
            msg.edit({ components: [] });
            collector.stop();
          } else if (col_id == "yes") {
            if (add) {
              const result = await client.manager.search(add, {
                requester: interaction.user,
              });
              const tracks = result.tracks;
              if (result.type === "PLAYLIST")
                for (let track of tracks) TrackAdd.push(track);
              else TrackAdd.push(tracks[0]);

              const LimitTrack = tracks.length + TrackAdd.length;
              if (LimitTrack > client.config.bot.LIMIT_TRACK) {
                interaction.followUp(
                  `${client.i18n.get(language, "playlist", "add_limit_track", {
                    limit: client.config.bot.LIMIT_TRACK,
                  })}`,
                );
                TrackAdd.length = 0;
                return;
              }

              TrackAdd.forEach(async (track) => {
                await client.db.push(`playlist.${pid[0]}.tracks`, {
                  title: track.title,
                  uri: track.uri,
                  length: track.length,
                  thumbnail: track.thumbnail,
                  author: track.author,
                  requester: track.requester, // Just case can push
                });
              });
            }

            if (remove) {
              const position = remove;
              const song = playlist.tracks[position - 1];
              if (!song)
                return interaction.editReply(
                  `${client.i18n.get(
                    language,
                    "playlist",
                    "remove_song_notfound",
                  )}`,
                );
              await client.db.pull(
                `playlist.${pid[0]}.tracks`,
                playlist.tracks[position - 1],
              );
            }

            await client.db.set(
              `playlist.${pid[0]}.name`,
              newname !== null ? newname : PlaylistName,
            );
            await client.db.set(
              `playlist.${pid[0]}.private`,
              private !== null ? private : playlist.private,
            );
            await client.db.set(
              `playlist.${pid[0]}.description`,
              des !== null ? des : playlist.description,
            );

            const embed = new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `${client.i18n.get(language, "playlist", "edit_accepted")}`,
              );
            await message.reply({ embeds: [embed] });
            msg.edit({ components: [] });
            return collector.stop();
          }
        });
        collector.on("end", async (collected, reason) => {
          if (reason === "time") {
            const embed = new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `${client.i18n.get(language, "playlist", "edit_timed_out")}`,
              );
            await msg.edit({ embeds: [embed], components: [] });
          }
        });
      } catch (e) {}
    }
    if (
      interaction.options.getString("add") ||
      interaction.options.getString("remove")
    ) {
      return RunCommands(newname, des, private, add, remove, playlist);
    }
    RunCommands(newname, des, private, add, remove, playlist);
  },
};
