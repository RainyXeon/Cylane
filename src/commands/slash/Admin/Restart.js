const { EmbedBuilder } = require('discord.js');
module.exports = { 
  name: ["settings", "restart"],
  description: "Shuts down the client!",
  categories: "Admin",
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });

    if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });

    const restart = new EmbedBuilder()
      .setDescription(`${client.i18n.get(language, "utilities", "restart_msg")}`)
      .setColor(client.color)
      .setFooter({ text: `© ${interaction.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        
    await interaction.editReply({ embeds: [restart] });
                    
    process.exit();

    }
};