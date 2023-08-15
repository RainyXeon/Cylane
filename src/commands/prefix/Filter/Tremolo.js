const { EmbedBuilder } = require("discord.js");
const delay = require("delay");

module.exports = {
  name: "tremolo",
  description: "Turning on tremolo filter",
  category: "Filter",
  usage: "",
  aliases: [],

  run: async (client, message, args, language, prefix) => {
    const msg = await message.channel.send(
      `${client.i18n.get(language, "filters", "filter_loading", {
        name: "tremolo",
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
      tremolo: {
        frequency: 4.0,
        depth: 0.75,
      },
    };

    await player.send(data);

    const embed = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(language, "filters", "filter_on", {
          name: "trembolo",
        })}`,
      )
      .setColor(client.color);

    await delay(2000);
    msg.edit({ content: " ", embeds: [embed] });
  },
};
