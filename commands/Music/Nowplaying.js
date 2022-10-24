const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');
// Main code
module.exports = { 
    name: "nowplaying",
    description: "Display the song currently playing.",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        const realtime = client.config.NP_REALTIME;
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "np_loading")}`);
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);
        const TotalDuration = formatDuration(song.length);
        const Thumbnail = `https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`;
        const Part = Math.floor(player.position / song.duration * 30);
        const Emoji = player.playing ? "🔴 |" : "⏸ |";

        const embeded = new EmbedBuilder()
            .setAuthor({ name: player.playing ? `${client.i18n.get(language, "music", "np_title")}` : `${client.i18n.get(language, "music", "np_title_pause")}`, iconURL: `${client.i18n.get(language, "music", "np_icon")}` })
            .setColor(client.color)
            .setDescription(`**[${song.title}](${song.uri})**`)
            .setThumbnail(Thumbnail)
            .addFields([
                { name: `${client.i18n.get(language, "music", "np_author")}`, value: `${song.author}`, inline: true },
                { name: `${client.i18n.get(language, "music", "np_duration")}`, value: `${TotalDuration}`, inline: true },
                { name: `${client.i18n.get(language, "music", "np_volume")}`, value: `${player.volume}%`, inline: true },
                { name: `${client.i18n.get(language, "music", "np_download")}`, value: `**[Click Here](https://www.y2mate.com/youtube/${song.identifier})**`, inline: true },
                { name: `${client.i18n.get(language, "music", "np_current_duration", {
                    current_duration: CurrentDuration,
                    total_duration: TotalDuration
                })}`, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\``, inline: false },
            ])
            .setTimestamp();

        const NEmbed = await msg.edit({ content: " ", embeds: [embeded] });
        var interval = null;

        if (realtime === 'true') {
        interval = setInterval(async () => {
            if (!player.playing) return;
            const CurrentDuration = formatDuration(player.position);
            const Part = Math.floor(player.position / song.duration * 30);
            const Emoji = player.playing ? "🔴 |" : "⏸ |";

            embeded.fields[6] = { name: `${client.i18n.get(language, "music", "np_current_duration", {
                current_duration: CurrentDuration,
                total_duration: TotalDuration
            })}`, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\`` };

            if (NEmbed) NEmbed.edit({ content: " ", embeds: [embeded] })
        }, 5000);
        } else if (realtime === 'false') {
            if (!player.playing) return;
            if (NEmbed) NEmbed.edit({ content: " ", embeds: [embeded] });
        }
    
    }
};