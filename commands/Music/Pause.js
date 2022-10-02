const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "pause",
    description: "Let bot pause the song",
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const { channel } = interaction.member.voice;
        const player = client.manager.players.get(interaction.guild.id);

        const msg = await interaction.editReply(`Loading...`);
        if (!player) return msg.edit(`I'm not in the voice channel!`)
        if (!channel) return msg.edit(`You need to be in the voice channel!`);
        
        await player.pause(true)
        const embed = new EmbedBuilder()
          .setDescription(`\`🔊\` | **Paused:** \`${channel.name}\``)
          .setColor(client.color)

        msg.edit({ content: " ", embeds: [embed] });
    }
};
