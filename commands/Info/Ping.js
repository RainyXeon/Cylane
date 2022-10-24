const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
    name: "ping",
    description: "Shows the ping information of the Bot",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
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
        
        await interaction.editReply({ embeds: [ping], components: [row3] });       
    }
};