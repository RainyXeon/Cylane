const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');
// Main code
module.exports = { 
    name: "nowplaying",
    description: "Display the song currently playing.",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        const realtime = client.config.NP_REALTIME;
        const msg = await interaction.editReply(`Loading...`);
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return msg.edit(`I'm not in the voice channel!`);

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);
        const TotalDuration = formatDuration(song.length);
        const Thumbnail = `https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`;
        const Part = Math.floor(player.position / song.duration * 30);
        const Emoji = player.playing ? "🔴 |" : "⏸ |";

        const embeded = new EmbedBuilder()
            .setAuthor({ name: player.playing ? `Now playing...` : `Song pause...`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif` })
            .setColor(client.color)
            .setDescription(`**[${song.title}](${song.uri})**`)
            .setThumbnail(Thumbnail)
            .addFields([
                { name: `Author:`, value: `${song.author}`, inline: true },
                { name: `Requester:`, value: `${song.requester}`, inline: true },
                { name: `Volume:`, value: `${player.volume}`, inline: true},
                { name: `Download:`, value: `**[Click Here](https://www.y2mate.com/youtube/${song.identifier})**`, inline: true },
                { name: "Queue Length:", value: `${player.queue.length}`, inline: true},
                { name: `Total Duration`, value: `${TotalDuration}`, inline: true },
                { name: `Current Duration: [${CurrentDuration} / ${TotalDuration}]`, value: `\`\`\`${Emoji} ${'─'.repeat(Part) + '🎶' + '─'.repeat(30 - Part)}\`\`\``, inline: false },
            ])
            // .addField(`${client.i18n.get(language, "music", "np_view")}`, `${views}`, true)
            // .addField(`${client.i18n.get(language, "music", "np_upload")}`, `${uploadat}`, true)
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