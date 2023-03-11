const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: ["previous"],
    description: "Play the previous song in the queue.",
    category: "Music",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "previous_loading")}`);

            const player = client.manager.players.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
            if (!player.queue.previous) return msg.edit(`${client.i18n.get(language, "music", "previous_notfound")}`);
    
            await player.queue.unshift(player.queue.previous);
            await player.skip()
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "previous_msg")}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [embed] });
    }
};