const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "loop",
    description: "Loop song in queue type all/current!",
    options: [
        {
            name: "type",
            description: "Type of loop",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Current",
                    value: "current"
                },
                {
                    name: "Queue",
                    value: "queue"
                },
                {
                    name: "None",
                    value: "none"
                }
            ]
        }
    ],
    run: async (interaction, client) => {
        await interaction.deferReply({ ephemeral: false });
        const { channel } = interaction.member.voice;
        const player = client.manager.players.get(interaction.guild.id);

        const msg = await interaction.editReply(`Loading...`);
        if (!player) return msg.edit(`I'm not in the voice channel!`)
        if (!channel) return msg.edit(`You need to be in the voice channel!`);

        const mode = interaction.options.get("type").value;
        const loop_mode = {
            none: "none", 
            track: "track", 
            queue: "queue"
        }

        if (mode == "current") {
            await player.setLoop(loop_mode.track)
            const embed = new EmbedBuilder()
                .setDescription(`\`🔊\` | **Selected loop mode:** \`${loop_mode.track}\`!`)
                .setColor(client.color)
  
            msg.edit({ content: " ", embeds: [embed] });
        } else if (mode == "queue") {
            await player.setLoop(loop_mode.queue)
            const embed = new EmbedBuilder()
                .setDescription(`\`🔊\` | **Selected loop mode:** \`${loop_mode.track}\`!`)
                .setColor(client.color)
  
            msg.edit({ content: " ", embeds: [embed] });
        } else if (mode == "none") {
            await player.setLoop(loop_mode.none)
            const embed = new EmbedBuilder()
                .setDescription(`\`🔊\` | **Selected loop mode:** \`${loop_mode.track}\`!`)
                .setColor(client.color)
  
            msg.edit({ content: " ", embeds: [embed] });
        }
    }
};
