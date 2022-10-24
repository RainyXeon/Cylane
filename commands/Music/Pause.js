const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: "pause",
    description: "Pause the music!",

    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
            const msg = await interaction.editReply(`${client.i18n.get(language, "music", "pause_loading")}`);

            const player = client.manager.get(interaction.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
            
            await player.pause(true);
            const uni = player.paused ? `${client.i18n.get(language, "music", "pause_switch_pause")}` : `${client.i18n.get(language, "music", "pause_switch_resume")}`;
    
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "pause_msg", {
                    pause: uni
                })}`)
                .setColor(client.color);
    
            msg.edit({ content: " ", embeds: [embed] });
    }
};