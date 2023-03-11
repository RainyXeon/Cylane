const { EmbedBuilder } = require('discord.js');

// Main code
module.exports = { 
    name: "leave",
    description: "Make the bot leave the voice channel.",
    category: "Music",
    usage: "",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
        
        const msg = await message.channel.send(`${client.i18n.get(language, "music", "leave_loading")}`);
        const player = client.manager.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        await player.destroy();

        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "music", "leave_msg", {
                channel: channel.name
            })}`)
            .setColor(client.color);   

        msg.edit({ content: " ", embeds: [embed] })
    
    }
};