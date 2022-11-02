const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["247"],
    description: "24/7 in voice channel",
    categories: "Music",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "247_loading")}`);

        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        if (player.twentyFourSeven) {
            player.twentyFourSeven = false;
            const off = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "247_off")}`)
                .setColor(client.color);
        msg.edit({ content: " ", embeds: [off] });
        } else {
            player.twentyFourSeven = true;
            const on = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "247_on")}`)
                .setColor(client.color);
            msg.edit({ content: " ", embeds: [on] });
        }
    }
}