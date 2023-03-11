const { EmbedBuilder } = require('discord.js');
const db = require("../../../plugins/schemas/autoreconnect")
module.exports = {
    name: "247",
    description: "24/7 in voice channel",
    category: "Music",
    usage: "",
    aliases: [],
    run: async (client, message, args, language, prefix) => {
        
        const msg = await message.channel.send(`${client.i18n.get(language, "music", "247_loading")}`);

        const player = client.manager.players.get(message.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        let data = await db.findOne({ guild: message.guild.id })

        if (data) {
            await data.delete();
            const on = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "247_off")}`)
                .setColor(client.color);
            msg.edit({ content: " ", embeds: [on] });

        } else if (!data) {
            data = new db({
                guild: player.guildId,
                text: player.textId,
                voice: player.voiceId
            })
            await data.save();
            const on = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "music", "247_on")}`)
                .setColor(client.color);
            msg.edit({ content: " ", embeds: [on] });
        }
    }
}