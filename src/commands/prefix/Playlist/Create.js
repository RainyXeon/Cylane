const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../../plugins/schemas/playlist.js");
var id = require('voucher-code-generator');

module.exports = {
    name: "playlist-create",
    description: "Create a new playlist",
    categories: "Playlist",
    usage: "<playlist_name> <playlist_description>",
    aliases: ["pl-create"],

    run: async (client, message, args, language, prefix) => {
        
        const value = args[0]
        const des = args[1]

        if(value.length > 16) return message.channel.send(`${client.i18n.get(language, "playlist", "create_toolong")}`);
        if (des && des.length > 1000) return message.channel.send(`${client.i18n.get(language, "playlist", "des_toolong")}`)

        const PlaylistName = value.replace(/_/g, ' ');
        const msg = await message.channel.send(`${client.i18n.get(language, "playlist", "create_loading")}`);

        const Limit = await Playlist.find({ owner: message.author.id }).countDocuments();
        const Exist = await Playlist.findOne({ name: PlaylistName, owner: message.author.id });

        if(Exist) { msg.edit(`${client.i18n.get(language, "playlist", "create_name_exist")}`); return; }
        if(Limit >= client.config.LIMIT_PLAYLIST) { msg.edit(`${client.i18n.get(language, "playlist", "create_limit_playlist", {
            limit: client.config.LIMIT_PLAYLIST
        })}`); return; }

        const idgen = id.generate({ length: 8, prefix: "playlist-", });

        const CreateNew = new Playlist({
            id: idgen[0],
            name: PlaylistName,
            owner: message.author.id,
            tracks: [],
            private: true,
            created: Date.now(),
            description: des ? des : null,
        });

        CreateNew.save().then(() => {
            const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "create_created", {
                playlist: PlaylistName
                })}`)
            .setColor(client.color)
        msg.edit({ content: " ", embeds: [embed] });
        });
    }
}