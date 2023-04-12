const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: "remove-duplicate",
    description: "Remove duplicated song from queue",
    category: "Music",
    usage: "",
    aliases: ["rmd", "rm-dup"],

    run: async (client, message, args, language, prefix) => {

      const msg = await message.channel.send(`${client.i18n.get(language, "music", "pause_loading")}`);
      const player = client.manager.players.get(message.guild.id);

      if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
      const { channel } = message.member.voice;

      if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

      OriginalQueueLength = player.queue.length

      for (let i = 0; i < player.queue.length; i++) {
        const element = player.queue[i];
        if (player.queue.current.uri == element.uri) {
          player.queue.splice(player.queue.indexOf(player.queue.current.uri), 1)
        }
      }

      const unique = [...new Map(player.queue.map((m) => [m.uri, m])).values()];

      player.queue.clear()
      player.queue.push(...unique)

      const embed = new EmbedBuilder()
          .setDescription(`${client.i18n.get(language, "music", "removetrack_duplicate_desc", {
              original: OriginalQueueLength,
              new: unique.length,
              removed: OriginalQueueLength - unique.length
          })}`)
          .setColor(client.color)
      

      await msg.edit({ embeds: [embed] });

      OriginalQueueLength = null
      return
    
    }
};