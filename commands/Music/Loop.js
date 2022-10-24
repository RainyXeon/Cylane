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
    run: async (interaction, client, language) => {
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
            const looped = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "loop_current")}`)
                .setColor(client.color);
            msg.edit({ content: " ", embeds: [looped] });

        } else if (mode == "queue") {
            await player.setLoop(loop_mode.queue)
            const looped_queue = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "loop_all")}`)
                .setColor(client.color);
            msg.edit({ content: " ", embeds: [looped_queue] });

        } else if (mode == "none") {
            await player.setLoop(loop_mode.none)
            const unloopall = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "unloop_all")}`)
                .setColor(client.color);
            msg.edit({ content: " ", embeds: [unloopall] });
        }
    }
};
