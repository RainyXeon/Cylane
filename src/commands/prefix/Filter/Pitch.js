const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const delay = require("delay");

module.exports = {
    name: "pitch",
    description: 'Sets the pitch of the song.',
    categories: "Filter",
    usage: "<number>",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
        
        const value = args[0]
        if (value && isNaN(value)) return message.channel.send(`${client.i18n.get(language, "music", "number_invalid")}`);

        const player = client.manager.players.get(message.guild.id);
        if(!player) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        if (value < 0) return message.channel.send(`${client.i18n.get(language, "filters", "filter_greater")}`);
        if (value > 10) return message.channel.send(`${client.i18n.get(language, "filters", "filter_less")}`);

        const data = {
            op: 'filters',
            guildId: message.guild.id,
            timescale: { pitch: value },
        }

        await player.send(data);

        const msg = await message.channel.send(`${client.i18n.get(language, "filters", "pitch_loading", {
            amount: value
        })}`);
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "pitch_on", {
                amount: value
            })}`)
            .setColor(client.color);
        await delay(2000);
        msg.edit({ content: " ", embeds: [embed] });
    
    }
}