const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../../plugins/schemas/playlist.js");

module.exports = {
    name: "playlist-public",
    description: "Public a playlist",
    categories: "Playlist",
    usage: "<playlist_name>",
    aliases: ["pl-public"],

    run: async (client, message, args, language, prefix) => {
        
        
        const value = args[0]
        const PName = value.replace(/_/g, ' ');

        const playlist = await Playlist.findOne({ name: PName, owner: message.author.id });
        if(!playlist) return message.channel.send(`${client.i18n.get(language, "playlist", "public_notfound")}`);
        if(playlist.owner !== message.author.id) return message.channel.send(`${client.i18n.get(language, "playlist", "public_owner")}`);

        const Public = await Playlist.findOne({ name: PName, private: false });
        if(Public) return message.channel.send(`${client.i18n.get(language, "playlist", "public_already")}`);

        const msg = await message.channel.send(`${client.i18n.get(language, "playlist", "public_loading")}`);

        playlist.private = false;

        playlist.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "public_success")}`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
        });
    }
}