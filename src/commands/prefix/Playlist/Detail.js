const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../../structures/FormatDuration.js');
const { NormalPage } = require('../../../structures/PageQueue.js');
const Playlist = require("../../../schemas/playlist.js");

module.exports = {
    name: "playlist-detail",
    description: "Detail a playlist",
    category: "Playlist",
    usage: "<playlist_name> <number>",
    aliases: ["pl-detail"],

    run: async (client, message, args, language, prefix) => {
        
        
        const value = args[0] ? args[0] : null;
        const number = args[1];

        if (number && isNaN(number)) return message.channel.send(`${client.i18n.get(language, "music", "number_invalid")}`);

        const Plist = value.replace(/_/g, ' ');
        
        const fullList = await client.db.get("playlist")

        const pid = Object.keys(fullList).filter(function(key) {
            return fullList[key].owner == message.author.id && fullList[key].name == Plist;
          })

        const playlist = fullList[pid[0]]

        if(!playlist) return message.channel.send(`${client.i18n.get(language, "playlist", "detail_notfound")}`);
        if(playlist.private && playlist.owner !== message.author.id) return message.channel.send(`${client.i18n.get(language, "playlist", "detail_private")}`);

        let pagesNum = Math.ceil(playlist.tracks.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        const playlistStrings = [];
        for(let i = 0; i < playlist.tracks.length; i++) {
            const playlists = playlist.tracks[i];
            playlistStrings.push(
                `${client.i18n.get(language, "playlist", "detail_track", {
                    num: i + 1,
                    title: playlists.title,
                    url: playlists.uri,
                    author: playlists.author,
                    duration: formatDuration(playlists.length)
                })}
                `);
        }

        const totalDuration = formatDuration(playlist.tracks.reduce((acc, cur) => acc + cur.length, 0));

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = playlistStrings.slice(i * 10, i * 10 + 10).join(`\n`);
            const embed = new EmbedBuilder() //${playlist.name}'s Playlists
                .setAuthor({ name: `${client.i18n.get(language, "playlist", "detail_embed_title", {
                    name: playlist.name
                })}`, iconURL: message.author.displayAvatarURL() })
                .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                .setColor(client.color) //Page • ${i + 1}/${pagesNum} | ${playlist.tracks.length} • Songs | ${totalDuration} • Total duration
                .setFooter({ text: `${client.i18n.get(language, "playlist", "detail_embed_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    songs: playlist.tracks.length,
                    duration: totalDuration
                })}` });

            pages.push(embed);
        }
        if (!number) {
            if (pages.length == pagesNum && playlist.tracks.length > 10) NormalPage(client, message, pages, 60000, playlist.tracks.length, totalDuration, language);
            else return message.channel.send({ embeds: [pages[0]] });
        } else {
            if (isNaN(number)) return message.channel.send(`${client.i18n.get(language, "playlist", "detail_notnumber")}`);
            if (number > pagesNum) return message.channel.send(`${client.i18n.get(language, "playlist", "detail_page_notfound", {
                page: pagesNum
            })}`);
            const pageNum = number == 0 ? 1 : number - 1;
            return message.channel.send({ embeds: [pages[pageNum]] });
        }
    }
}