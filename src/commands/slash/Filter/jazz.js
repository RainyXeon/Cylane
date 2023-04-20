const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["filter", "jazz"],
    description: "Turning on jazz filter",
    category: "Filter",
    run: async (client, interaction, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const msg = await interaction.editReply(`${client.i18n.get(language, "filters", "filter_loading", {
            name: "jazz"
            })}`);
        const player = client.manager.players.get(interaction.guild.id);
        if(!player) return interaction.editReply(`No playing in this guild!`);
        if(!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        const data = {
            op: 'filters',
            guildId: interaction.guild.id,
            equalizer: [
                { band: 0, gain: 0 },
                { band: 1, gain: 0 },
                { band: 2, gain: 0 },
                { band: 3, gain: 0 },
                { band: 4, gain: 0 },
                { band: 5, gain: 0 },
                { band: 6, gain: 0 },
                { band: 7, gain: 0.35 },
                { band: 8, gain: 0.35 },
                { band: 9, gain: 0.35 },
                { band: 10, gain: 0.35 },
                { band: 11, gain: 0.35 },
                { band: 12, gain: 0.35 },
                { band: 13, gain: 0.35 },
            ]
        }

        await player.send(data);

        const embed = new EmbedBuilder()
         .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                name: "jazz"
            })}`)
            .setColor(client.color);

        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
     }
}
