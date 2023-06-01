const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { SlashPlaylist } = require('../../../structures/PageQueue.js');
const Playlist = require("../../../schemas/playlist.js");
const humanizeDuration = require('humanize-duration');

module.exports = {
    name: "playlist-view",
    description: "View your playlists",
    category: "Playlist",
    usage: "<number>",
    aliases: ["pl-view"],

    run: async (client, message, args, language, prefix) => {
        
        const number = args[0]
        if (value && isNaN(value)) return message.channel.send(`${client.i18n.get(language, "music", "number_invalid")}`);
        const playlists = await Playlist.find({ owner: message.author.id });

        let pagesNum = Math.ceil(playlists.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        const playlistStrings = [];
        for(let i = 0; i < playlists.length; i++) {
            const playlist = playlists[i];
            const created = humanizeDuration(Date.now() - playlists[i].created, { largest: 1 })
            playlistStrings.push(
                `${client.i18n.get(language, "playlist", "view_embed_playlist", {
                    num: i + 1,
                    name: playlist.name,
                    tracks: playlist.tracks.length,
                    create: created
                })}
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = playlistStrings.slice(i * 10, i * 10 + 10).join('');
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "playlist", "view_embed_title", {
                    user: message.author.username
                })}`, iconURL: message.author.displayAvatarURL() })
                .setDescription(`${str == '' ? '  Nothing' : '\n' + str}`)
                .setColor(client.color)
                .setFooter({ text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
                    page: i + 1,
                    pages: pagesNum,
                    songs: playlists.length
                })}` });

            pages.push(embed);
        }
        if (!number) {
            if (pages.length == pagesNum && playlists.length > 10) SlashPlaylist(client, message, pages, 30000, playlists.length, language);
            else return message.channel.send({ embeds: [pages[0]] });
        } else {
            if (isNaN(number)) return message.channel.send({ content: `${client.i18n.get(language, "playlist", "view_notnumber")}` });
            if (number > pagesNum) return message.channel.send({ content: `${client.i18n.get(language, "playlist", "view_page_notfound", {
                page: pagesNum
            })}` });
            const pageNum = number == 0 ? 1 : number - 1;
            return message.channel.send({ embeds: [pages[pageNum]] });
        }
    }
}