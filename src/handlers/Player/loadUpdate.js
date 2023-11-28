const { Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const formatDuration = require("../../structures/FormatDuration.js");
const { QueueDuration } = require("../../structures/QueueDuration.js");

module.exports = async (client) => {
  const file = new AttachmentBuilder("../../../assets/banner.jpg");
  client.UpdateQueueMsg = async function (player) {
    let data = await client.db.get(`setup.guild_${player.guildId}`);
    if (data.enable === false) return;

    let channel = await client.channels.cache.get(data.channel);
    if (!channel) return;

    let playMsg = await channel.messages.fetch(data.playmsg, {
      cache: false,
      force: true,
    });
    if (!playMsg) return;

    let guildModel = await client.db.get(`language.guild_${player.guildId}`);
    if (!guildModel) {
      guildModel = await client.db.set(
        `language.guild_${player.guildId}`,
        client.config.bot.LANGUAGE,
      );
    }

    const language = guildModel;

    const songStrings = [];
    const queuedSongs = player.queue.map(
      (song, i) =>
        `${client.i18n.get(language, "setup", "setup_content_queue", {
          index: i + 1,
          title: song.title,
          duration: formatDuration(song.length),
          request: song.requester,
        })}`,
    );

    const current_song = `${client.i18n.get(
      language,
      "setup",
      "setup_content_queue",
      {
        index: `${1}`,
        title: player.queue.current.title,
        duration: formatDuration(player.queue.current.length),
        request: `${player.queue.current.requester}`,
      },
    )}`;

    await songStrings.push(...queuedSongs);

    await songStrings.unshift(current_song);

    const Str = songStrings.slice(0, 10).join("\n");

    const TotalDuration = QueueDuration(player);

    let cSong = player.queue.current;
    let qDuration = `${formatDuration(TotalDuration)}`;

    let embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.i18n.get(language, "setup", "setup_author")}`,
        iconURL: `${client.i18n.get(language, "setup", "setup_author_icon")}`,
      })
      .setDescription(
        `${client.i18n.get(language, "setup", "setup_desc", {
          title: cSong.title,
          url: cSong.uri,
          duration: formatDuration(cSong.length),
          request: cSong.requester,
        })}`,
      ) // [${cSong.title}](${cSong.uri}) \`[${formatDuration(cSong.duration)}]\` • ${cSong.requester}
      .setColor(client.color)
      .setImage(`${cSong.thumbnail}`)
      .setFooter({
        text: `${client.i18n.get(language, "setup", "setup_footer", {
          songs: player.queue.size,
          volume: player.volume,
          duration: qDuration,
        })}`,
      }); //${player.queue.length} • Song's in Queue | Volume • ${player.volume}% | ${qDuration} • Total Duration

    return await playMsg
      .edit({
        content: `${client.i18n.get(language, "setup", "setup_content")}\n${
          Str == ""
            ? `${client.i18n.get(language, "setup", "setup_content_empty")}`
            : "\n" + Str
        }`,
        embeds: [embed],
        components: [client.enSwitch],
      })
      .catch((e) => {});
  };

  /**
   *
   * @param {Player} player
   */
  client.UpdateMusic = async function (player) {
    let data = await client.db.get(`setup.guild_${player.guildId}`);
    if (data.enable === false) return;

    let channel = await client.channels.cache.get(data.channel);
    if (!channel) return;

    let playMsg = await channel.messages.fetch(data.playmsg, {
      cache: true,
      force: true,
    });
    if (!playMsg) return;

    let guildModel = await client.db.get(`language.guild_${player.guildId}`);
    if (!guildModel) {
      guildModel = await client.db.set(
        `language.guild_${player.guildId}`,
        client.config.bot.LANGUAGE,
      );
    }

    const language = guildModel;

    const queueMsg = `${client.i18n.get(language, "setup", "setup_queuemsg")}`;

    const playEmbed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${client.i18n.get(language, "setup", "setup_playembed_author")}`,
      })
      .setImage(
        `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.jpeg?size=300`,
      )
      .setDescription(
        `${client.i18n.get(language, "setup", "setup_playembed_desc", {
          clientId: client.user.id,
        })}`,
      )
      .setFooter({
        text: `${client.i18n.get(language, "setup", "setup_playembed_footer")}`,
      });

    return await playMsg
      .edit({
        content: `${queueMsg}`,
        embeds: [playEmbed],
        components: [client.diSwitch],
      })
      .catch((e) => {});
  };
};
