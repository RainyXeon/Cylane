const { EmbedBuilder } = require("discord.js");
const delay = require("delay");

module.exports = {
  name: "reset",
  description: "Reset filter",
  category: "Filter",
  usage: "",
  aliases: [],

  run: async (client, message, args, language, prefix) => {
    const msg = await message.channel.send(
      `${client.i18n.get(language, "filters", "reset_loading")}`,
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
    };

    await player.send(data);
    await player.setVolume(100);

    const resetted = new EmbedBuilder()
      .setDescription(`${client.i18n.get(language, "filters", "reset_on")}`)
      .setColor(client.color);

    await delay(2000);
    msg.edit({ content: " ", embeds: [resetted] });
  },
};
