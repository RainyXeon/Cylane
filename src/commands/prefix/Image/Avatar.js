const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: "avatar",
    description: "Show your or someone else's profile picture",
    category: "Image",
    usage: "<mention>",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
    const value = message.mentions.users.first()

    if (!value) return message.channel.send(`${client.i18n.get(language, "utilities", "arg_error", { text: "@mention" })}`);

      if (value) {
          const embed = new EmbedBuilder()
              .setTitle(value.username + " " + value.discriminator)
              .setImage(`https://cdn.discordapp.com/avatars/${value.id}/${value.avatar}.jpeg?size=300`)
              .setColor(client.color)
              .setFooter({ text: `© ${message.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
          await message.channel.send({ embeds: [embed] });
      } else {
          const embed = new EmbedBuilder()
              .setTitle(message.author.username + " " + message.author.discriminator)
              .setImage(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg?size=300`)
              .setColor(client.color)
              .setFooter({ text: `© ${message.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
          await message.channel.send({ embeds: [embed] });
      }     
  }
};