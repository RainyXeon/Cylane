const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: "clear",
    description: "Clear song in queue!",
    categories: "Music",
    usage: "",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
        
        const msg = await message.channel.send(`${client.i18n.get(language, "music", "clearqueue_loading")}`);
        const player = client.manager.players.get(message.guild.id);
        if (!player) return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);
        await player.queue.clear();
        
        const cleared = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "clearqueue_msg")}`)
            .setColor(client.color);
        msg.edit({ content: " ", embeds: [cleared] });
    }
};