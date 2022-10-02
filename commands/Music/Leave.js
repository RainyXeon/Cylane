const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "leave",
    description: "Let bot leave the voice channel",
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const { channel } = interaction.member.voice;
        const player = client.manager.players.get(interaction.guild.id);

        const msg = await interaction.editReply(`Loading...`);
        if (!player) return msg.edit(`I'm not in the voice channel!`)
        if (!channel) return msg.edit(`You need to be in the voice channel!`);
        
        await player.destroy()
        const embed = new EmbedBuilder()
          .setDescription(`\`🔊\` | **Left:** \`${channel.name}\``)
          .setColor(client.color)

        msg.edit({ content: " ", embeds: [embed] });
    }
};
