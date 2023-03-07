const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: "face-palm",
    description: "Post the random face palm",
    categories: "Anime",
    usage: "<mention>",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
        let link = ""
        
        await fetch('https://some-random-api.ml/animu/face-palm').then(res => res.json()).then(json => link = json.link);

        const value = message.mentions.users.first()

        if (value){
            const embed = new EmbedBuilder()
                .setDescription(`*Bruh <@${value.id}>*`)
                .setImage(link)
                .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                .setColor(client.color)
            message.channel.send({ embeds: [embed] })
        } else {
            const embed = new EmbedBuilder()
                .setImage(link)
                .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                .setColor(client.color)
            message.channel.send({ embeds: [embed] })
        }
    }
};