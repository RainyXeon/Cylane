const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: ["anime", "wink"],
    description: "Post the random wink",
    categories: "Anime",
    premium: false,
    run: async (interaction, client, language) => {
        let link = ""
        await interaction.deferReply({ ephemeral: false });
        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });
        await fetch('https://some-random-api.ml/animu/wink').then(res => res.json()).then(json => link = json.link);
        const embed = new EmbedBuilder()
            .setImage(link)
            .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        interaction.editReply({ embeds: [embed] })
    }
};