const { EmbedBuilder } = require("discord.js");

// Main code
module.exports = {
  name: "loopall",
  description: "Loop all songs in queue!",
  category: "Music",
  usage: "",
  aliases: ["lq"],

  run: async (client, message, args, language, prefix) => {
    const loop_mode = {
      none: "none",
      track: "track",
      queue: "queue",
    };

    const msg = await message.channel.send(
      `${client.i18n.get(language, "music", "loopall_loading")}`,
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

    if (player.loop === "queue") {
      await player.setLoop(loop_mode.none);

      const unloopall = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "unloopall")}`)
        .setColor(client.color);

      return msg.edit({ content: " ", embeds: [unloopall] });
    } else if (player.loop === "none") {
      await player.setLoop(loop_mode.queue);

      const loopall = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "loopall")}`)
        .setColor(client.color);

      return msg.edit({ content: " ", embeds: [loopall] });
    }
  },
};
