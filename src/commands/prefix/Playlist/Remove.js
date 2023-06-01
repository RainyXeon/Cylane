const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../../schemas/playlist.js");

module.exports = {
    name: "playlist-remove",
    description: "Remove a song from a playlist",
    category: "Playlist",
    usage: "<playlist_name> <song_postion>",
    aliases: ["pl-remove"],

    run: async (client, message, args, language, prefix) => {

        const value = args[0];
        const pos = args[1];

        if (pos && isNaN(pos)) return message.channel.send(`${client.i18n.get(language, "music", "number_invalid")}`);

        const Plist = value.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: Plist, owner: message.author.id });
        if(!playlist) return message.channel.send(`${client.i18n.get(language, "playlist", "remove_notfound")}`);
        if(playlist.owner !== message.author.id) return message.channel.send(`${client.i18n.get(language, "playlist", "remove_owner")}`);
    
        const position = pos;
        const song = playlist.tracks[position];
        if(!song) return message.channel.send(`${client.i18n.get(language, "playlist", "remove_song_notfound")}`);
        playlist.tracks.splice(position - 1, 1);
        await playlist.save();
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "remove_removed", {
                name: Plist,
                position: pos
                })}`)
            .setColor(client.color)
        message.channel.send({ embeds: [embed] });
    }
}