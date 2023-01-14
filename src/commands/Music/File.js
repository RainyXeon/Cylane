const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");
// Main code
module.exports = {
    name: ["mp3"],
    description: "Play the music file for the bot",
    categories: "Music",
    options: [
        {
            name: "file",
            description: "The music file to play",
            type: ApplicationCommandOptionType.Attachment,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        let player = client.manager.players.get(interaction.guild.id)

        const file = await interaction.options.getAttachment("file")
        const msg = await interaction.editReply(`${client.i18n.get(language, "music", "play_loading", {
            result: file.name
        })}`);
        const { channel } = interaction.member.voice;
        if (!channel) return msg.edit(`${client.i18n.get(language, "music", "play_invoice")}`);
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Connect)) return msg.edit(`${client.i18n.get(language, "music", "play_join")}`);
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Speak)) return msg.edit(`${client.i18n.get(language, "music", "play_speak")}`);
        if (file.contentType !== "audio/mpeg" && file.contentType !== "audio/ogg") return msg.edit(`${client.i18n.get(language, "music", "play_invalid_file")}`)
        if (!file.contentType) msg.edit(`${client.i18n.get(language, "music", "play_warning_file")}`)

        if (!player) player = await client.manager.createPlayer({
            guildId: interaction.guild.id,
            voiceId: interaction.member.voice.channel.id,
            textId: interaction.channel.id,
            deaf: true,
        });

        const result = await player.search(file.attachment, { requester: interaction.user });
        const tracks = result.tracks;

        if (!result.tracks.length) return msg.edit({ content: `${client.i18n.get(language, "music", "play_match")}` });
        if (result.type === 'PLAYLIST') for (let track of tracks) player.queue.add(track)
        else if (player.playing && result.type === 'SEARCH') player.queue.add(tracks[0])
        else if (player.playing && result.type !== 'SEARCH') for (let track of tracks) player.queue.add(track)
        else player.play(tracks[0]);

        if (result.type === 'PLAYLIST') {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
                    title: file.name,
                    url: file.attachment,
                    length: tracks.length
                })}`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
            if (!player.playing) player.play();
        } else if (result.type === 'TRACK') {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "play_track", {
                    title: file.name,
                    url: file.attachment,
                })}`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
            if (!player.playing) player.play();
        } else if (result.type === 'SEARCH') {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "music", "play_result", {
                    title: file.name,
                    url: file.attachment,
                })}`)
            msg.edit({ content: " ", embeds: [embed] });
            if (!player.playing) player.play();
        }
        else {
            msg.edit(`${client.i18n.get(language, "music", "play_match")}`);
            player.destroy();
        }
    }
};