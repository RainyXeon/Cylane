const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');

// Main code
module.exports = { 
    name: ["seek"],
    description: "Seek timestamp in the song!",
    categories: "Music",
    options: [
        {
            name: "seconds",
            description: "The number of seconds to seek the timestamp by.",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        const value = interaction.options.getNumber("seconds");
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "seek_loading")}`);
        
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        if(value * 1000 >= player.queue.current.length || value < 0) return msg.edit(`${client.i18n.get(language, "music", "seek_beyond")}`);
        await player.send({ op: "seek", guildId: interaction.guild.id, position: value * 1000 });

        const song_position = player.shoukaku.position

        const Duration = formatDuration(song_position);

        const seeked = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "seek_msg", {
                duration: Duration
            })}`)
            .setColor(client.color);

        msg.edit({ content: ' ', embeds: [seeked] });
    }
};