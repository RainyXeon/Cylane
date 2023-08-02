const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Shows the ping information of the Bot",
    category: "Info",
    usage: "",
    aliases: [],
    run: async (client, message, args, language, prefix) => {
        
          const ping = new EmbedBuilder()
              .setTitle(`${client.i18n.get(language, "info", "ping_title")}` + client.user.username)
              .setDescription(`${client.i18n.get(language, "info", "ping_desc", { ping: client.ws.ping })}`)
              .setTimestamp()
              .setColor(client.color);
          const row3 = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel("Invite Me")
                  .setStyle("Link")
                  .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
              )
        
        await message.reply({ embeds: [ping], components: [row3] });       
    }
};