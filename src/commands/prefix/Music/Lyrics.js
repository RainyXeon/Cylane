const { EmbedBuilder } = require('discord.js');
const lyricsfinder = require('lyrics-finder');

// Main code
module.exports = { 
    name: "lyrics",
    description: "Display lyrics of a song.",
    category: "Music",
    usage: "<song_name>",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
        
            const msg = await message.channel.send(`${client.i18n.get(language, "music", "lyrics_loading")}`);
            const value = args[0]
    
            const player = client.manager.players.get(message.guild.id);
            if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            let song = value;
                let CurrentSong = player.queue.current;
            if (!song && CurrentSong) song = CurrentSong.title;
    
            let lyrics = null;
    
            try {
                lyrics = await lyricsfinder(song, "");
                if (!lyrics) return msg.edit(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
            } catch (err) {
                logger.log({ level: "error", message: err });
                return msg.edit(`${client.i18n.get(language, "music", "lyrics_notfound")}`);
            }
            let lyricsEmbed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle(`${client.i18n.get(language, "music", "lyrics_title", {
                    song: song
                })}`)
                .setDescription(`${lyrics}`)
                .setFooter({ text: `Requested by ${message.author.username}`})
                .setTimestamp();
    
            if (lyrics.length > 2048) {
                lyricsEmbed.setDescription(`${client.i18n.get(language, "music", "lyrics_toolong")}`);
            }
    
            msg.edit({ content: ' ', embeds: [lyricsEmbed] });
    }
};