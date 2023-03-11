const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: ["anime", "face", "palm"],
    description: "Post the random face palm",
    category: "Anime",
    options: [
        {
            name: "user",
            description: "Type your user here",
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    run: async (interaction, client, language) => {
        let link = ""
        await interaction.deferReply({ ephemeral: false });
        await fetch('https://some-random-api.ml/animu/face-palm').then(res => res.json()).then(json => link = json.link);
        const value = interaction.options.getUser("user")

        if (value){
            const embed = new EmbedBuilder()
                .setDescription(`*Bruh <@${value.id}>*`)
                .setImage(link)
                .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                .setColor(client.color)
            interaction.editReply({ embeds: [embed] })
        } else {
            const embed = new EmbedBuilder()
                .setImage(link)
                .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                .setColor(client.color)
            interaction.editReply({ embeds: [embed] })
        }
    }
};