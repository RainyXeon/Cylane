const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../../schemas/playlist.js");

module.exports = {
    name: "playlist-private",
    description: "Private a playlist",
    category: "Playlist",
    usage: "<playlist_name",
    aliases: ["pl-private"],

    run: async (client, message, args, language, prefix) => {
        
        const value = args[0]
        const PName = value.replace(/_/g, ' ');
 
        const playlist = await Playlist.findOne({ name: PName, owner: message.author.id });
        if(!playlist) return message.channel.send(`${client.i18n.get(language, "playlist", "private_notfound")}`);
        if(playlist.owner !== message.author.id) return message.channel.send(`${client.i18n.get(language, "playlist", "private_owner")}`);

        const Private = await Playlist.findOne({ name: PName, private: true });
        if(Private) return message.channel.send(`${client.i18n.get(language, "playlist", "private_already")}`);

        const msg = await message.channel.send(`${client.i18n.get(language, "playlist", "private_loading")}`);

        playlist.private = true;

        playlist.save().then(() => {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "playlist", "private_success")}`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
        });
    }
}