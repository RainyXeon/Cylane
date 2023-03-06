const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const Premium = require("../../../plugins/schemas/premium.js");

module.exports = {
    name: ["profile"],
    description: "View your premium profile!",
    categories: "Premium",
    premium: true,
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const PremiumPlan = await Premium.findOne({ Id: interaction.user.id })
        const expires = moment(PremiumPlan.premium.expiresAt).format('do/MMMM/YYYY (HH:mm:ss)');

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.i18n.get(language, "premium", "profile_author")}`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${client.i18n.get(language, "premium", "profile_desc", {
                user: interaction.user.tag,
                plan: PremiumPlan.premium.plan,
                expires: expires
            })}`)
            .setColor(client.color)
            .setTimestamp()

        return interaction.editReply({ embeds: [embed] });

    }
}