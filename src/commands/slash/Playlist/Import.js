const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const { convertTime } = require("../../../structures/ConvertTime.js");
const Playlist = require("../../../plugins/schemas/playlist.js");
let playlist

module.exports = {
    name: ["playlist", "import"],
    description: "Import a playlist to queue.",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "id",
            description: "The id of the playlist",
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getString("name");
        const id = interaction.options.getString("id")
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

        const SongAdd = [];
        let SongLoad = 0;

        if (id) playlist = await Playlist.findOne({ id: id });
        if (value) {
            const Plist = value.replace(/_/g, ' ');
            playlist = await Playlist.findOne({ name: Plist, owner: interaction.user.id });
        }
        if (!id && !value) return interaction.editReply(`${client.i18n.get(language, "playlist", "no_id_or_name")}`)
        if (id && value) return interaction.editReply(`${client.i18n.get(language, "playlist", "got_id_and_name")}`)
        if (!playlist) return interaction.deferReply(`${client.i18n.get(language, "playlist", "invalid")}`)

        if(playlist.private && playlist.owner !== interaction.user.id) { interaction.editReply(`${client.i18n.get(language, "playlist", "import_private")}`); return; }

        const totalDuration = convertTime(playlist.tracks.reduce((acc, cur) => acc + cur.length, 0));

        const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "import_loading")}`);

        for (let i = 0; i < playlist.tracks.length; i++) {
            const res = await player.search(playlist.tracks[i].uri, { requester: interaction.user });
            if(res.type == "TRACK") {
                SongAdd.push(res.tracks[0]);
                SongLoad++;
            } else if(res.type == "PLAYLIST") {
                for (let t = 0; t < res.tracks.length; t++) {
                    SongAdd.push(res.tracks[t]);
                    SongLoad++;
                }
            } else if(res.type == "SEARCH") {
                SongAdd.push(res.tracks[0]);
                SongLoad++;
            }
            if(SongLoad == playlist.tracks.length) {
                player.queue.add(SongAdd);
                const embed = new EmbedBuilder() // **Imported • \`${Plist}\`** (${playlist.tracks.length} tracks) • ${message.user}
                    .setDescription(`${client.i18n.get(language, "playlist", "import_imported", {
                        name: playlist.name,
                        tracks: playlist.tracks.length,
                        duration: totalDuration,
                        user: interaction.user
                    })}`)
                    .setColor(client.color)
    
                msg.edit({ content: " ", embeds: [embed] });
                if (!player.playing) { player.play(); }
            }
        }
    }
}