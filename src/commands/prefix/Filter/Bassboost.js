const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const delay = require("delay");

module.exports = {
    name: "bassboost",
    description: 'Turning on bassboost filter',
    category: "Filter",
    usage: "<number>",
    aliases: [],

    run: async (message, client, user, language) => {
        
        const value = message.options.getInteger('amount');
        if (value && isNaN(value)) return message.channel.send(`${client.i18n.get(language, "music", "number_invalid")}`);

        const player = client.manager.players.get(message.guild.id);
        if(!player) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        if(!value) {
            const data = {
                op: 'filters',
                guildId: message.guild.id,
                equalizer: [
                    { band: 0, gain: 0.10 },
                    { band: 1, gain: 0.10 },
                    { band: 2, gain: 0.05 },
                    { band: 3, gain: 0.05 },
                    { band: 4, gain: -0.05 },
                    { band: 5, gain: -0.05 },
                    { band: 6, gain: 0 },
                    { band: 7, gain: -0.05 },
                    { band: 8, gain: -0.05 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0.05 },
                    { band: 11, gain: 0.05 },
                    { band: 12, gain: 0.10 },
                    { band: 13, gain: 0.10 },
                ]
            }

            await player.send(data);

        const msg1 = message.channel.send(`${client.i18n.get(language, "filters", "filter_loading", {
                name: client.commands.get('bassboost').config.name
            })}`);
        const embed = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "filters", "filter_on", {
                name: client.commands.get('bassboost').config.name
            })}`)
                .setColor(client.color);
                
        await delay(2000);
                return msg1.edit({ content: " ", embeds: [embed] });
            } 

        if(isNaN(value)) return message.channel.send(`${client.i18n.get(language, "filters", "filter_number")}`);
            if(value > 10 || value < -10) return message.channel.send(`${client.i18n.get(language, "filters", "bassboost_limit")}`);
                const data = {
                    op: 'filters',
                    guildId: message.guild.id,
                    equalizer: [
                        { band: 0, gain: value / 10 },
                        { band: 1, gain: value / 10 },
                        { band: 2, gain: value / 10 },
                        { band: 3, gain: value / 10 },
                        { band: 4, gain: value / 10 },
                        { band: 5, gain: value / 10 },
                        { band: 6, gain: value / 10 },
                        { band: 7, gain: 0 },
                        { band: 8, gain: 0 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0 },
                        { band: 11, gain: 0 },
                        { band: 12, gain: 0 },
                        { band: 13, gain: 0 },
                    ]
                }
                await player.node.send(data);
        const msg2 = message.channel.send(`${client.i18n.get(language, "filters", "bassboost_loading", {
                    amount: value
                    })}`);
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "filters", "bassboost_set", {
                    amount: value
                    })}`)
            .setColor(client.color);
                
        await delay(2000);
        return msg2.edit({ content: " ", embeds: [embed] });
    }
}