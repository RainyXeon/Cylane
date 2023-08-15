const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Radiostations } = require("../../../plugins/radioLink.js");
const { convertTime } = require("../../../structures/ConvertTime.js");
// Main code
module.exports = {
  name: "radio",
  description: "Play radio in voice channel",
  category: "Music",
  usage: "",
  aliases: [],
  lavalink: true,

  run: async (client, message, args, language, prefix) => {
    const msg = await message.channel.send(
      `${client.i18n.get(language, "music", "radio_loading")}`,
    );

    const value = args[0];
    if (value && isNaN(value))
      return msg.edit(
        `${client.i18n.get(language, "music", "number_invalid")}`,
      );

    const { channel } = message.member.voice;
    if (!channel)
      return msg.edit(
        `${client.i18n.get(language, "music", "search_invoice")}`,
      );
    if (
      !message.guild.members.cache
        .get(client.user.id)
        .permissions.has(PermissionsBitField.Flags.Connect)
    )
      return msg.edit(`${client.i18n.get(language, "music", "radio_join")}`);
    if (
      !message.guild.members.cache
        .get(client.user.id)
        .permissions.has(PermissionsBitField.Flags.Speak)
    )
      return msg.edit(`${client.i18n.get(language, "music", "radio_speak")}`);

    const resultsEmbed = new EmbedBuilder()
      .setTitle(`${client.i18n.get(language, "radio", "available_radio")}`) //
      .addFields([
        {
          name: `${client.i18n.get(language, "radio", "standard_radio")}`,
          value: `**1:  ** [\`${Radiostations[1 - 1].split(" ")[0]}\`](${
            Radiostations[1 - 1].split(" ")[1]
          })
              **2:  ** [\`${Radiostations[2 - 1].split(" ")[0]}\`](${
                Radiostations[2 - 1].split(" ")[1]
              })
              **3:  ** [\`${Radiostations[3 - 1].split(" ")[0]}\`](${
                Radiostations[3 - 1].split(" ")[1]
              })
              **4:  ** [\`${Radiostations[4 - 1].split(" ")[0]}\`](${
                Radiostations[4 - 1].split(" ")[1]
              })
              **5:  ** [\`${Radiostations[5 - 1].split(" ")[0]}\`](${
                Radiostations[5 - 1].split(" ")[1]
              })
              `,
          inline: true,
        },
        {
          name: `${client.i18n.get(language, "radio", "standard_radio")}`,
          value: `**6:  ** [\`${Radiostations[6 - 1].split(" ")[0]}\`](${
            Radiostations[6 - 1].split(" ")[1]
          })
              **7:  ** [\`${Radiostations[7 - 1].split(" ")[0]}\`](${
                Radiostations[7 - 1].split(" ")[1]
              })
              **8:  ** [\`${Radiostations[8 - 1].split(" ")[0]}\`](${
                Radiostations[8 - 1].split(" ")[1]
              })
              **9:  ** [\`${Radiostations[9 - 1].split(" ")[0]}\`](${
                Radiostations[9 - 1].split(" ")[1]
              })
              **10: ** [\`${Radiostations[10 - 1].split(" ")[0]}\`](${
                Radiostations[10 - 1].split(" ")[1]
              })
              `,
          inline: true,
        },
        { name: `\u200b`, value: `\u200b`, inline: true },

        {
          name: `***🇬🇧 British RADIO:***`,
          value: `**11: ** [\`${Radiostations[11 - 1].split(" ")[0]}\`](${
            Radiostations[11 - 1].split(" ")[1]
          })
      **12: ** [\`${Radiostations[12 - 1].split(" ")[0]}\`](${
        Radiostations[12 - 1].split(" ")[1]
      })
      `,
          inline: true,
        },
        {
          name: `***🇬🇧 British RADIO:***`,
          value: `
      **13: ** [\`${Radiostations[13 - 1].split(" ")[0]}\`](${
        Radiostations[13 - 1].split(" ")[1]
      })
      **14: ** [\`${Radiostations[14 - 1].split(" ")[0]}\`](${
        Radiostations[14 - 1].split(" ")[1]
      })
      `,
          inline: true,
        },
        {
          name: `***🇬🇧 British RADIO:***`,
          value: `
      **15: ** [\`${Radiostations[15 - 1].split(" ")[0]}\`](${
        Radiostations[15 - 1].split(" ")[1]
      })
      **16: ** [\`${Radiostations[16 - 1].split(" ")[0]}\`](${
        Radiostations[16 - 1].split(" ")[1]
      })
      `,
          inline: true,
        },

        {
          name: `***🇦🇺 AUSTRALIA RADIO:***`,
          value: `**17: ** [\`${Radiostations[17 - 1].split(" ")[0]}\`](${
            Radiostations[17 - 1].split(" ")[1]
          })
      **18: ** [\`${Radiostations[18 - 1].split(" ")[0]}\`](${
        Radiostations[18 - 1].split(" ")[1]
      })`,
          inline: true,
        },

        {
          name: `***🇦🇹 AUSTRIA RADIO:***`,
          value: `**19: ** [\`${Radiostations[19 - 1].split(" ")[0]}\`](${
            Radiostations[19 - 1].split(" ")[1]
          })
      **20: ** [\`${Radiostations[20 - 1].split(" ")[0]}\`](${
        Radiostations[20 - 1].split(" ")[1]
      })`,
          inline: true,
        },

        {
          name: `***🇫🇷 France RADIO:***`,
          value: ` **21: ** [\`${Radiostations[21 - 1].split(" ")[0]}\`](${
            Radiostations[21 - 1].split(" ")[1]
          })
      **22: ** [\`${Radiostations[22 - 1].split(" ")[0]}\`](${
        Radiostations[22 - 1].split(" ")[1]
      })`,
          inline: true,
        },

        {
          name: `***🇮🇹 Italy RADIO:***`,
          value: `**23: ** [\`${Radiostations[23 - 1].split(" ")[0]}\`](${
            Radiostations[23 - 1].split(" ")[1]
          })
      **24: ** [\`${Radiostations[24 - 1].split(" ")[0]}\`](${
        Radiostations[24 - 1].split(" ")[1]
      })`,
          inline: true,
        },

        {
          name: `***🇪🇪 Estonia RADIO:***`,
          value: `**25: ** [\`${Radiostations[25 - 1].split(" ")[0]}\`](${
            Radiostations[25 - 1].split(" ")[1]
          })
      **26: ** [\`${Radiostations[26 - 1].split(" ")[0]}\`](${
        Radiostations[26 - 1].split(" ")[1]
      })`,
          inline: true,
        },

        {
          name: `***🇪🇸 Spain RADIO:***`,
          value: `**27: ** [\`${Radiostations[27 - 1].split(" ")[0]}\`](${
            Radiostations[27 - 1].split(" ")[1]
          })
      **28: ** [\`${Radiostations[28 - 1].split(" ")[0]}\`](${
        Radiostations[28 - 1].split(" ")[1]
      })`,
          inline: true,
        },

        {
          name: `***🇨🇿 Czech RADIO:***`,
          value: `**29: ** [\`${Radiostations[29 - 1].split(" ")[0]}\`](${
            Radiostations[29 - 1].split(" ")[1]
          })
      **30: ** [\`${Radiostations[30 - 1].split(" ")[0]}\`](${
        Radiostations[30 - 1].split(" ")[1]
      })`,
          inline: true,
        },

        {
          name: `***🇳🇱 Netherlands RADIO:***`,
          value: `**31: ** [\`${Radiostations[31 - 1].split(" ")[0]}\`](${
            Radiostations[31 - 1].split(" ")[1]
          })
      **32: ** [\`${Radiostations[32 - 1].split(" ")[0]}\`](${
        Radiostations[32 - 1].split(" ")[1]
      })`,
          inline: true,
        },

        {
          name: `***🇵🇱 Polska RADIO:***`,
          value: `**33: ** [\`${Radiostations[33 - 1].split(" ")[0]}\`](${
            Radiostations[33 - 1].split(" ")[1]
          })
      **34: ** [\`${Radiostations[34 - 1].split(" ")[0]}\`](${
        Radiostations[34 - 1].split(" ")[1]
      })`,
          inline: true,
        },
      ])
      .setColor(client.color)
      .setFooter({ text: `/radio <1-34>` })
      .setTimestamp();

    if (!value) {
      return msg.edit({ content: " ", embeds: [resultsEmbed] });
    } else if (Number(value) > 34 || Number(value) < 0) {
      return msg.edit({ content: " ", embeds: [resultsEmbed] });
    }

    const player = await client.manager.createPlayer({
      guildId: message.guild.id,
      voiceId: message.member.voice.channel.id,
      textId: message.channel.id,
      deaf: true,
    });

    let i;

    for (i = 1; i <= 1 + Radiostations.length; i++) {
      if (Number(value) === Number(i)) {
        break;
      }
    }

    const args2 = Radiostations[i - 1].split(` `);

    const song = args2[1];

    const res = await player.search(song, { requester: message.author });

    if (res.type == "TRACK") {
      player.queue.add(res.tracks[0]);
      const embed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "music", "play_track", {
            title: args2[0],
            url: res.tracks[0].uri,
            duration: convertTime(res.tracks[0].length, true),
            request: res.tracks[0].requester,
          })}`,
        )
        .setColor(client.color);
      msg.edit({ content: " ", embeds: [embed] });
      if (!player.playing) player.play();
    }
    player.twentyFourSeven = true;
  },
};
