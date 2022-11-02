const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["test"],
    description: "Test the unofficial command",
    categories: "Admin",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });
          const ping = new EmbedBuilder()
              .setTitle(`Done!`)
              .setColor(client.color);
        
        await interaction.editReply({ embeds: [ping], components: [row3] });       
    }
};