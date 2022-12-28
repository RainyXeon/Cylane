const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: ["resume"],
    description: "Resume the music!",
    categories: "Music",
    premium: false,
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "resume_loading")}`);

        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        
        await player.pause(false)
        const uni = player.paused ? `${client.i18n.get(language, "music", "resume_switch_pause")}` : `${client.i18n.get(language, "music", "resume_switch_resume")}`;

        await client.websocket.send(
            JSON.stringify(
              {           
                op: player.paused ? 3 : 4, 
                guild: interaction.guild.id
              }
            )
          )

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "resume_msg", {
                resume: uni
            })}`)
            .setColor(client.color);

        msg.edit({ content: " ", embeds: [embed] });
    }
};