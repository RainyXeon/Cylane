const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "volume",
    description: "Adjusts the volume of the bot.",
    options: [
        {
            name: "amount",
            description: "The amount of volume to set the bot to.",
            type: 4,
            required: false,
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const input = interaction.options.getInteger("amount");
        const { channel } = interaction.member.voice;
        const player = client.manager.players.get(interaction.guild.id);

        const msg = await interaction.editReply(`Loading...`);
        if (!channel) return msg.edit(`You need to be in the voice channel!`);
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Connect)) return msg.edit(`I don't have \`CONNECT\` permissions to run this command!`);
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Speak)) return msg.edit(`I don't have \`SPEAK\` permissions to execute this command!`);

        if (Number(input) <= 0 || Number(input) > 100) return msg.edit(`Volume is only allowed from 0 to 100`);
        await player.setVolume(Number(input));

        const embed = new EmbedBuilder()
          .setDescription(`\`🔊\` | **Changed volume to:** \`${Number(input)}\``)
          .setColor(client.color)

        msg.edit({ content: " ", embeds: [embed] });
        
    }
};
