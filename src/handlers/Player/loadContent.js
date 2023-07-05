const { EmbedBuilder, Client, Message } = require("discord.js");
const { convertTime } = require("../../structures/ConvertTime.js");
const delay = require("delay");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    try {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.guild || interaction.user.bot) return;
            if (interaction.isButton()) {
                const { customId, member } = interaction;
                let voiceMember = interaction.guild.members.cache.get(member.id);
                let channel = voiceMember.voice.channel;

                let player = await client.manager.players.get(interaction.guild.id);
                if (!player) return;

                const playChannel = client.channels.cache.get(player.textId);
                if (!playChannel) return;

                let guildModel = await client.db.get(`language.guild_${player.guildId}`)
                if (!guildModel) {
                    guildModel = await client.db.set(`language.guild_${player.guildId}`, client.config.bot.LANGUAGE)
                }

                const language = guildModel;

                switch (customId) {
                    case "sprevious":
                        {
                            if (!channel) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                            } else if (!player || !player.queue.previous) {
                                return interaction.reply(`${client.i18n.get(language, "music", "previous_notfound")}`);
                            } else {
                                await player.queue.unshift(player.queue.previous);
                                await player.skip();

                                const embed = new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(language, "music", "previous_msg")}`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sskip":
                        {
                            if (!channel) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                            } else if (!player) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                            } else { }
                            if (player.queue.size == 0) {
                                await player.destroy();
                                await client.UpdateMusic(player);

                                const embed = new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            } else {
                                await player.skip();

                                const embed = new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(language, "music", "skip_msg")}`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sstop":
                        {
                            if (!channel) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                            } else if (!player) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                            } else {
                                await player.destroy();
                                await client.UpdateMusic(player);

                                const embed = new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(language, "player", "stop_msg")}`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "spause":
                        {
                            if (!channel) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
                            } else if (!player) {
                                return interaction.reply(`${client.i18n.get(language, "noplayer", "no_player")}`);
                            } else {
                                await player.pause(!player.paused);
                                const uni = player.paused ? `${client.i18n.get(language, "player", "switch_pause")}` : `${client.i18n.get(language, "player", "switch_resume")}`;

                                const embed = new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(language, "player", "pause_msg", {
                                        pause: uni,
                                    })}`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sloop":
                        {
                            if (!player) {
                                collector.stop();
                            }
                            const loop_mode = {
                                none: "none",
                                track: "track",
                                queue: "queue"
                            }

                            if (player.loop === "queue") {
                                await player.setLoop(loop_mode.none)

                                const unloopall = new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(language, "music", "unloopall")}`)
                                    .setColor(client.color);
                                return await interaction.reply({ content: ' ', embeds: [unloopall] });
                            } else if (player.loop === "none") {
                                await player.setLoop(loop_mode.queue)
                                const loopall = new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(language, "music", "loopall")}`)
                                    .setColor(client.color);
                                return await interaction.reply({ content: ' ', embeds: [loopall] });
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
    /**
     * @param {Client} client
     * @param {Message} message
     */

    client.on("messageCreate", async (message) => {
        if (!message.guild || !message.guild.available) return;
        let database = await client.db.get(`setup.guild_${message.guild.id}`)
        let player = client.manager.players.get(message.guild.id)

        if (!database) await client.db.set(`setup.guild_${message.guild.id}`, {
            enable: false,
            channel: "",
            playmsg: "",
            voice: "",
            category: ""
        })

        database = await client.db.get(`setup.guild_${message.guild.id}`)

        if (!database.enable) return;

        let channel = await message.guild.channels.cache.get(database.channel);
        if (!channel) return;

        if (database.channel != message.channel.id) return;

        let guildModel = await client.db.get(`language.guild_${message.guild.id}`)
        if (!guildModel) {
            guildModel = await client.db.set(`language.guild_${message.guild.id}`, "en")
        }


        const language = guildModel;

        if (message.author.id === client.user.id) {
            await delay(3000);
            message.delete()
        }

        if (message.author.bot) return;

        const song = message.cleanContent;
        await message.delete();
        if (!song) return

        let voiceChannel = await message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_voice")}`).then((msg) => {
            setTimeout(() => {
                msg.delete()
            }, 4000);
        });

        let msg = await message.channel.messages.fetch(database.playmsg)

        if (!player) player = await client.manager.createPlayer({
            guildId: message.guild.id,
            voiceId: message.member.voice.channel.id,
            textId: message.channel.id,
            deaf: true,
        });

        const result = await player.search(song, { requester: message.author });
        const tracks = result.tracks;

        if (!result.tracks.length) return msg.edit({
            content: `${client.i18n.get(language, "setup", "setup_content")}\n${Str == '' ? `${client.i18n.get(language, "setup", "setup_content_empty")}` : '\n' + Str}`,
        });
        if (result.type === 'PLAYLIST') for (let track of tracks) player.queue.add(track)
        else if (player.playing && result.type === 'SEARCH') player.queue.add(tracks[0])
        else if (player.playing && result.type !== 'SEARCH') for (let track of tracks) player.queue.add(track)
        else player.play(tracks[0]);

        if (result.type === 'PLAYLIST') {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "play_playlist", {
                    title: result.tracks[0].title,
                    url: value,
                    duration: convertTime(TotalDuration),
                    songs: result.tracks.length,
                    request: result.tracks[0].requester
                })}`)
                .setColor(client.color)
            msg.reply({ content: " ", embeds: [embed] });
        } else if (result.type === 'TRACK') {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "play_track", {
                    title: result.tracks[0].title,
                    url: result.tracks[0].uri,
                    duration: convertTime(result.tracks[0].length, true),
                    request: result.tracks[0].requester
                })}`)
                .setColor(client.color)
            msg.reply({ content: " ", embeds: [embed] });
        } else if (result.type === 'SEARCH') {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "music", "play_result", {
                    title: result.tracks[0].title,
                    url: result.tracks[0].uri,
                    duration: convertTime(result.tracks[0].length, true),
                    request: result.tracks[0].requester
                })}`)
            msg.reply({ content: " ", embeds: [embed] });
        }
        
        await client.UpdateQueueMsg(player);
    });
};
