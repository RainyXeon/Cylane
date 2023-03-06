const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: "wink",
    description: "Post the random wink",
    categories: "Anime",
    usage: "<mention>",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
        let link = ""
        
        await fetch('https://some-random-api.ml/animu/wink').then(res => res.json()).then(json => link = json.link);
        const value = message.mentions.users.first()
        
        const embed = new EmbedBuilder()
            .setImage(link)
            .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            .setColor(client.color)
        message.channel.send({ embeds: [embed] })
    }
};