const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: ["anime", "pat"],
    description: "Post the random pat",
    categories: "Anime",
    premium: false,
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
        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });
        await fetch('https://some-random-api.ml/animu/pat').then(res => res.json()).then(json => link = json.link);
        const value = interaction.options.getUser("user")

        if (value){
            const embed = new EmbedBuilder()
                .setDescription(`*Pats <@${value.id}>*`)
                .setImage(link)
                .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            interaction.editReply({ embeds: [embed] })
        } else {
            const embed = new EmbedBuilder()
                .setImage(link)
                .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            interaction.editReply({ embeds: [embed] })
        }
    }
};