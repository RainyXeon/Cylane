const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { SlashPlaylist } = require("../../../structures/PageQueue.js");
const humanizeDuration = require("humanize-duration");

module.exports = {
  name: ["playlist", "all"],
  description: "View all your playlists",
  category: "Playlist",
  options: [
    {
      name: "page",
      description: "The page you want to view",
      required: false,
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });
    const number = interaction.options.getInteger("page");
    const playlists = [];

    const fullList = await client.db.get("playlist");

    Object.keys(fullList)
      .filter(function (key) {
        return fullList[key].owner == interaction.user.id;
      })
      .forEach(async (key, index) => {
        playlists.push(fullList[key]);
      });

    let pagesNum = Math.ceil(playlists.length / 10);
    if (pagesNum === 0) pagesNum = 1;

    const playlistStrings = [];
    for (let i = 0; i < playlists.length; i++) {
      const playlist = playlists[i];
      const created = humanizeDuration(Date.now() - playlists[i].created, {
        largest: 1,
      });
      playlistStrings.push(
        `${client.i18n.get(language, "playlist", "view_embed_playlist", {
          num: i + 1,
          name: playlist.name,
          tracks: playlist.tracks.length,
          create: created,
        })}
                `,
      );
    }

    const pages = [];
    for (let i = 0; i < pagesNum; i++) {
      const str = playlistStrings.slice(i * 10, i * 10 + 10).join(`\n`);
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${client.i18n.get(language, "playlist", "view_embed_title", {
            user: interaction.user.username,
          })}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(`${str == "" ? "  Nothing" : "\n" + str}`)
        .setColor(client.color)
        .setFooter({
          text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
            page: i + 1,
            pages: pagesNum,
            songs: playlists.length,
          })}`,
        });

      pages.push(embed);
    }
    if (!number) {
      if (pages.length == pagesNum && playlists.length > 10) {
        SlashPlaylist(
          client,
          interaction,
          pages,
          30000,
          playlists.length,
          language,
        );
        return (playlists.length = 0);
      } else {
        await interaction.editReply({ embeds: [pages[0]] });
        return (playlists.length = 0);
      }
    } else {
      if (isNaN(number))
        return interaction.editReply({
          content: `${client.i18n.get(language, "playlist", "view_notnumber")}`,
        });
      if (number > pagesNum)
        return interaction.editReply({
          content: `${client.i18n.get(
            language,
            "playlist",
            "view_page_notfound",
            {
              page: pagesNum,
            },
          )}`,
        });
      const pageNum = number == 0 ? 1 : number - 1;
      await interaction.editReply({ embeds: [pages[pageNum]] });
      return (playlists.length = 0);
    }
  },
};
