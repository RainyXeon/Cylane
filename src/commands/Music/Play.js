const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = {
    name: "play",
    description: "Play a song from any types",
    options: [
        {
            name: "search",
            description: "The song link or name",
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    run: async (interaction, client, language) => {
        try {
            if (interaction.options.getString("search")) {
                await interaction.deferReply({ ephemeral: false });
                const value = interaction.options.get("search").value;
                const msg = await interaction.editReply(`${client.i18n.get(language, "music", "play_loading", {
                    result: interaction.options.get("search").value
                })}`);
                
                const { channel } = interaction.member.voice;
                if (!channel) return msg.edit(`${client.i18n.get(language, "music", "play_invoice")}`);
                if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Connect)) return msg.edit(`${client.i18n.get(language, "music", "play_join")}`);
                if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Speak)) return msg.edit(`${client.i18n.get(language, "music", "play_speak")}`);
        
                const player = await client.manager.createPlayer({
                    guildId: interaction.guild.id,
                    voiceId: interaction.member.voice.channel.id,
                    textId: interaction.channel.id,
                    deaf: true,
                  });
                
                const result = await player.search(value, { requester: interaction.user });
                const tracks = result.tracks;
        
                if (!result.tracks.length) return msg.edit({ content: 'No result was found' });
                if (result.type === 'PLAYLIST') for (let track of tracks) player.queue.add(track) 
                else player.play(tracks[0]);
        
                if (result.type === 'PLAYLIST'){
                    const embed = new EmbedBuilder()
                        .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
                            title: tracks[0].title,
                            url: value,
                            duration: convertTime(tracks[0].length),
                            songs: tracks.length,
                            request: tracks[0].requester
                        })}`)
                        .setColor(client.color)
                    msg.edit({ content: " ", embeds: [embed] });
                    if(!player.playing) player.play();
                } else if (result.type === 'TRACK') {
                    const embed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "music", "play_track", {
                        title: tracks[0].title,
                        url: tracks[0].uri,
                        duration: convertTime(tracks[0].length, true),
                        request: tracks[0].requester
                    })}`)
                    .setColor(client.color)
                    msg.edit({ content: " ", embeds: [embed] });
                } else if (result.type === 'SEARCH') {
                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(`${client.i18n.get(language, "music", "play_result", {
                            title: tracks[0].title,
                            url: tracks[0].uri,
                            duration: convertTime(tracks[0].length, true),
                            request: tracks[0].requester
                        })}`)
                    msg.edit({ content: " ", embeds: [embed] });
                }         
            }
        } catch (e) {
            
        }        
    }
};
