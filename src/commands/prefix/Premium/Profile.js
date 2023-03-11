const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const Premium = require("../../../plugins/schemas/premium.js");

module.exports = {
    name: "profile",
    description: "View your premium profile!",
    category: "Premium",
    usage: "",
    aliases: [],
    premium: true,
    run: async (client, message, args, language, prefix) => {
        
        
        const PremiumPlan = await Premium.findOne({ Id: message.author.id })
        const expires = moment(PremiumPlan.premium.expiresAt).format('do/MMMM/YYYY (HH:mm:ss)');

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.i18n.get(language, "premium", "profile_author")}`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${client.i18n.get(language, "premium", "profile_desc", {
                user: message.author.tag,
                plan: PremiumPlan.premium.plan,
                expires: expires
            })}`)
            .setColor(client.color)
            .setTimestamp()

        return message.channel.send({ embeds: [embed] });

    }
}