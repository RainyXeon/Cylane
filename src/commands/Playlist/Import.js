const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");
const Playlist = require("../../plugins/schemas/playlist.js");

module.exports = {
    name: "pl-import",
    description: "Import a playlist to queue.",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getString("name");
        const { channel } = interaction.member.voice;
        if (!channel) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_voice")}`);
        if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_join")}`);
        if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(channel).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`${client.i18n.get(language, "playlist", "import_speak")}`);

        const player = await client.manager.createPlayer({
            guildId: interaction.guild.id,
            voiceId: interaction.member.voice.channel.id,
            textId: interaction.channel.id,
            deaf: true,
          });

        const Plist = value.replace(/_/g, ' ');
        const SongAdd = [];
        let SongLoad = 0;

        const playlist = await Playlist.findOne({ name: Plist });
        if(!playlist) { interaction.editReply(`${client.i18n.get(language, "playlist", "import_notfound")}`); return; }
        if(playlist.private && playlist.owner !== interaction.user.id) { interaction.editReply(`${client.i18n.get(language, "playlist", "import_private")}`); return; }

        const totalDuration = convertTime(playlist.tracks.reduce((acc, cur) => acc + cur.length, 0));

        const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "import_loading")}`);

        const embed = new EmbedBuilder() // **Imported • \`${Plist}\`** (${playlist.tracks.length} tracks) • ${message.user}
            .setDescription(`${client.i18n.get(language, "playlist", "import_imported", {
                name: Plist,
                tracks: playlist.tracks.length,
                duration: totalDuration,
                user: interaction.user
            })}`)
            .setColor(client.color)

        msg.edit({ content: " ", embeds: [embed] });

        for (let i = 0; i < playlist.tracks.length; i++) {
            const res = await player.search(playlist.tracks[i].uri);
            player.queue.add(res.tracks[0])
            if(res.type == "TRACK") {
                SongAdd.push(res.tracks[0]);
                SongLoad++;
                if (!player.playing) player.play();
            } else if(res.type == "PLAYLIST") {
                for (let t = 0; t < res.tracks.length; t++) {
                    SongAdd.push(res.tracks[t]);
                    SongLoad++;
                }
                if (!player.playing) player.play();
            } else if(res.type == "SEARCH") {
                SongAdd.push(res.tracks[0]);
                SongLoad++;
                if (!player.playing) player.play();
            }
            if(SongLoad == playlist.tracks.length) {
                player.queue.add(SongAdd);
                if (!player.playing) { player.play(); }
            }
        }
    }
}