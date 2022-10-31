const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, } = require("discord.js");
const formatduration = require('../../structures/FormatDuration.js');
const { QueueDuration } = require("../../structures/QueueDuration.js");
const GControl = require("../../plugins/schemas/control.js")
const GLang = require("../../plugins/schemas/language.js")
const Setup = require("../../plugins/schemas/setup.js")
  
module.exports = async (client, player, track) => {
	client.logger.info(`Player Started in @ ${player.guildId}`);
  let Control = await GControl.findOne({ guild: player.guildId });
  if (!Control) {
    Control = await GControl.create({
      guild: player.guildId,
      playerControl: "disable",
    });
  }

  if(!player) return;

  /////////// Update Music Setup ///////////

  await client.UpdateQueueMsg(player);

  /////////// Update Music Setup ///////////

  const channel = client.channels.cache.get(player.textId);
  if (!channel) return;

  let data = await Setup.findOne({ guild: channel.guild.id });
  if (player.textChannel === data.channel) return;

  if (Control.playerControl === 'disable') return

	let guildModel = await GLang.findOne({
		guild: channel.guild.id,
	});
	if (!guildModel) {
		guildModel = await GLang.create({
			guild: channel.guild.id,
			language: "en",
		});
	}
	const { language } = guildModel;

    const song = player.queue.current;
    const position = player.shoukaku.position

  const TotalDuration = QueueDuration(player)
  
  const embeded = new EmbedBuilder()
    .setAuthor({ name: `${client.i18n.get(language, "player", "track_title")}`, iconURL: `${client.i18n.get(language, "player", "track_icon")}` })
    .setDescription(`**[${track.title}](${track.uri})**`)
    .setColor(client.color)
    .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/hqdefault.jpg`)
    .addFields([
      { name: `${client.i18n.get(language, "player", "author_title")}`, value: `${song.author}`, inline: true },
      { name: `${client.i18n.get(language, "player", "request_title")}`, value: `${song.requester}`, inline: true },
      { name: `${client.i18n.get(language, "player", "volume_title")}`, value: `${player.volume}%`, inline: true },
      { name: `${client.i18n.get(language, "player", "queue_title")}`, value: `${player.queue.length}`, inline: true },
      { name: `${client.i18n.get(language, "player", "duration_title")}`, value: `${formatduration(song.length, true)}`, inline: true },
      { name: `${client.i18n.get(language, "player", "total_duration_title")}`, value: `${formatduration(TotalDuration)}`, inline: true },
      { name: `${client.i18n.get(language, "player", "download_title")}`, value: `**[${song.title} - y2mate.com](https://www.y2mate.com/youtube/${song.identifier})**`, inline: false },
      { name: `${client.i18n.get(language, "player", "current_duration_title", {
        current_duration: formatduration(song.length, true),
      })}`, value: `\`\`\`🔴 | 🎶──────────────────────────────\`\`\``, inline: false },
    ])
    .setTimestamp();
  
  const row = new ActionRowBuilder()
  .addComponents([
    new ButtonBuilder()
    .setCustomId("pause")
    .setEmoji("⏯")
    .setStyle("Success"),

    new ButtonBuilder()
      .setCustomId("replay")
      .setEmoji("⬅")
      .setStyle("Primary"),
    
    new ButtonBuilder()
      .setCustomId("stop")
      .setEmoji("✖")
      .setStyle("Danger"),

    new ButtonBuilder()
      .setCustomId("skip")
      .setEmoji("➡")
      .setStyle("Primary"),

    new ButtonBuilder()
      .setCustomId("loop")
      .setEmoji("🔄")
      .setStyle("Success")
  ])
    
    const row2 = new ActionRowBuilder()
      .addComponents([
        new ButtonBuilder()
          .setCustomId("shuffle")
          .setEmoji("🔀")
          .setStyle("Success"),

        new ButtonBuilder()
          .setCustomId("voldown")
          .setEmoji("🔉")
          .setStyle("Primary"),

        new ButtonBuilder()
          .setCustomId("clear")
          .setEmoji("🗑")
          .setStyle("Danger"),

        new ButtonBuilder()
          .setCustomId("volup")
          .setEmoji("🔊")
          .setStyle("Primary"),

        new ButtonBuilder()
          .setCustomId("queue")
          .setEmoji("📋")
          .setStyle("Success")
      ])
    
    const nplaying = await client.channels.cache.get(player.textId).send({ embeds: [embeded], components: [row, row2] });

    const filter = (message) => {
      if(message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) return true;
      else {
        message.reply({ content: `${client.i18n.get(language, "player", "join_voice")}`, ephemeral: true });
      }
    };
    const collector = nplaying.createMessageComponentCollector({ filter, time: song.length });

    collector.on('collect', async (message) => {
      const id = message.customId;
      if(id === "pause") {
      if(!player) {
          collector.stop();
      }
        await player.pause(!player.paused);
        const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
              pause: uni,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if (id === "skip") {
        if(!player) {
          collector.stop();
        }
        await player.skip();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "skip_msg")}`)
            .setColor(client.color);

        await nplaying.edit({ embeds: [embeded], components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "stop") {
        if(!player) {
          collector.stop();
        }

        await player.destroy();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
            .setColor(client.color);
        
        await nplaying.edit({ embeds: [embeded], components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "shuffle") {
        if(!player) {
          collector.stop();
        }
        await player.queue.shuffle();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "shuffle_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "loop") {
        if(!player) {
          collector.stop();
        }
        await player.setLoop(!player.loop);
        const uni = player.loop ? `${client.i18n.get(language, "player", "switch_enable")}` : `${client.i18n.get(language, "player", "switch_disable")}`;

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "repeat_msg", {
              loop: uni,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      } else if(id === "volup") {
        if(!player) {
          collector.stop();
        }
        await player.setVolume(player.volume + 5);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "volup_msg", {
              volume: player.volume,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "voldown") {
        if(!player) {
          collector.stop();
        }
        await player.setVolume(player.volume - 5);

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "voldown_msg", {
              volume: player.volume,
            })}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "replay") {
        if(!player) {
          collector.stop();
        }
        await player.send({ op: "seek", guildId: interaction.guild.id, position: 0 });

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "replay_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
      else if(id === "queue") {
        if(!player) {
          collector.stop();
        }
        const song = player.queue.current;
        const qduration = `${formatduration(song.length)}`;
        const thumbnail = `https://img.youtube.com/vi/${song.identifier}/hqdefault.jpg`;
    
        let pagesNum = Math.ceil(player.queue.length / 10);
        if(pagesNum === 0) pagesNum = 1;
    
        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
          const song = player.queue[i];
          songStrings.push(
            `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatduration(song.length)}]\`
            `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
          const str = songStrings.slice(i * 10, i * 10 + 10).join('');
    
          const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.i18n.get(language, "player", "queue_author", {
              guild: message.guild.name,
            })}`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setThumbnail(thumbnail)
            .setColor(client.color)
            .setDescription(`${client.i18n.get(language, "player", "queue_description", {
              track: song.title,
              track_url: song.uri,
              duration: formatduration(position),
              requester: song.requester,
              list_song: str == '' ? '  Nothing' : '\n' + str,
            })}`)
            .setFooter({ text: `${client.i18n.get(language, "player", "queue_footer", {
              page: i + 1,
              pages: pagesNum,
              queue_lang: player.queue.length,
              total_duration: qduration,
            })}` });
    
          pages.push(embed);
        }
        message.reply({ embeds: [pages[0]], ephemeral: true });
      }
      else if(id === "clear") {
        if(!player) {
          collector.stop();
        }
        await player.queue.clear();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "player", "clear_msg")}`)
            .setColor(client.color);

        message.reply({ embeds: [embed], ephemeral: true });
      }
    });
    collector.on('end', async (collected, reason) => {
      if(reason === "time") {
        nplaying.edit({ embeds: [embeded], components: [] })
      }
    });
}