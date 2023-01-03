const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: ["replay"],
    description: "Replay the current song!",
    categories: "Music",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "replay_loading")}`);

        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
      
        await player.send({ op: "seek", guildId: interaction.guild.id, position: 0 });

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "replay_msg")}`)
            .setColor(client.color);

        msg.edit({ content: " ", embeds: [embed] });
    }
};