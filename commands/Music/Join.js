const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "join",
    description: "Let bot join into the voice channel",
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const { channel } = interaction.member.voice;
        const player = client.manager.players.get(interaction.guild.id);

        const msg = await interaction.editReply(`Loading...`);
        if (!channel) return msg.edit(`You need to be in the voice channel!`);
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Connect)) return msg.edit(`I don't have \`CONNECT\` permissions to run this command!`);
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Speak)) return msg.edit(`I don't have \`SPEAK\` permissions to execute this command!`);

        await client.manager.createPlayer({
            guildId: interaction.guild.id,
            voiceId: interaction.member.voice.channel.id,
            textId: interaction.channel.id,
            deaf: true,
          });
        const embed = new EmbedBuilder()
          .setDescription(`\`🔊\` | **Joined:** \`${channel.name}\``)
          .setColor(client.color)

        msg.edit({ content: " ", embeds: [embed] });
        
    }
};
