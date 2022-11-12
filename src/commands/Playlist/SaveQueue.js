const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../plugins/schemas/playlist.js");

const TrackAdd = [];

module.exports = {
    name: ["playlist", "save", "queue"],
    description: "Save the current queue to a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getString("name");
        const Plist = value.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: Plist, owner: interaction.user.id });

        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "savequeue_owner")}`);

        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);

        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        const queue = player.queue.map(track => track);
        const current = player.queue.current;

        TrackAdd.push(current);
        TrackAdd.push(...queue);
        
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "savequeue_saved", {
                name: Plist,
                tracks: queue.length + 1
                })}`)
            .setColor(client.color)
        interaction.editReply({ embeds: [embed] });

        TrackAdd.forEach(track => {
            playlist.tracks.push(
              {
                title: track.title,
                uri: track.uri,
                length: track.length,
                thumbnail: track.thumbnail,
                author: track.author,
                requester: track.requester // Just case can push
              }
            )
        });
        playlist.save().then(() => {
            TrackAdd.length = 0;
        });
    }
}