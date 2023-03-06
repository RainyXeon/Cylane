const { EmbedBuilder } = require('discord.js');
module.exports = { 
  name: "restart",
  description: "Shuts down the client!",
  categories: "Admin",
  accessableby: "Owner",
  usage: "",
  aliases: [],

  run: async (client, message, args, language, prefix) => {
    if(message.user.id != client.owner) return message.channel.send({ content: `${client.i18n.get(language, "message", "owner_only")}` });

    const restart = new EmbedBuilder()
      .setDescription(`${client.i18n.get(language, "utilities", "restart_msg")}`)
      .setColor(client.color)
      .setFooter({ text: `© ${message.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        
    await message.channel.send({ embeds: [restart] });
                    
    process.exit();

    }
};