const { EmbedBuilder } = require("discord.js");
const delay = require("delay");

module.exports = {
  name: "vaporwave",
  description: "Turning on vaporwave filter",
  category: "Filter",
  usage: "",
  aliases: [],

  run: async (client, message, args, language, prefix) => {
    const msg = await message.channel.send(
      `${client.i18n.get(language, "filters", "filter_loading", {
        name: "vaporwave",
      })}`,
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

    const data = {
      op: "filters",
      guildId: message.guild.id,
      equalizer: [
        { band: 0, gain: 0 },
        { band: 1, gain: 0 },
        { band: 2, gain: 0 },
        { band: 3, gain: 0 },
        { band: 4, gain: 0 },
        { band: 5, gain: 0 },
        { band: 6, gain: 0 },
        { band: 7, gain: 0 },
        { band: 8, gain: 0.15 },
        { band: 9, gain: 0.15 },
        { band: 10, gain: 0.15 },
        { band: 11, gain: 0.15 },
        { band: 12, gain: 0.15 },
        { band: 13, gain: 0.15 },
      ],
      timescale: {
        pitch: 0.55,
      },
    };

    await player.send(data);

    const vaporwaved = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(language, "filters", "filter_on", {
          name: "vaporwave",
        })}`,
      )
      .setColor(client.color);

    await delay(2000);
    msg.edit({ content: " ", embeds: [vaporwaved] });
  },
};
