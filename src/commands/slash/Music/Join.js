const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: ["join"],
    description: "Make the bot join the voice channel.",
    category: "Music",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "join_loading")}`);
        const { channel } = interaction.member.voice;
        if(!channel) return msg.edit(`${client.i18n.get(language, "music", "join_voice")}`);

        await client.manager.createPlayer({
          guildId: interaction.guild.id,
          voiceId: interaction.member.voice.channel.id,
          textId: interaction.channel.id,
          deaf: true,
        });

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "join_msg", {
                channel: channel.name
            })}`)
            .setColor(client.color)

        msg.edit({ content: " ", embeds: [embed] })
    
    }
};