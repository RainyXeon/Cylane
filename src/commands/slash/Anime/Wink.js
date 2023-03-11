const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: ["anime", "wink"],
    description: "Post the random wink",
    category: "Anime",
    run: async (interaction, client, language) => {
        let link = ""
        await interaction.deferReply({ ephemeral: false });
        await fetch('https://some-random-api.ml/animu/wink').then(res => res.json()).then(json => link = json.link);
        const embed = new EmbedBuilder()
            .setImage(link)
            .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            .setColor(client.color)
        interaction.editReply({ embeds: [embed] })
    }
};