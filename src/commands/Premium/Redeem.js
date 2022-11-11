const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const moment = require('moment');
const Premium = require("../../plugins/schemas/premium.js");
const Redeem = require("../../plugins/schemas/redeem.js");

module.exports = {
    name: ["redeem"],
    description: "Redeem your premium!",
    category: "Premium",
    options: [
        {
            name: "code",
            description: "The code you want to redeem",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const input = interaction.options.getString("code");
        
        let member = await Premium.findOne({ Id: interaction.user.id })

        if (member && member.isPremium) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_already")}`)
            return interaction.editReply({ embeds: [embed] });
        }
  
        const premium = await Redeem.findOne({ code: input.toUpperCase() });
        if (premium) {
            const expires = moment(premium.expiresAt).format('dddd, MMMM YYYY HH:mm:ss')

            const newMem = new Premium({
                Id: interaction.user.id,
                isPremium: true,
                premium: {
                    redeemedBy: interaction.user,
                    redeemedAt: Date.now(),
                    expiresAt: premium.expiresAt,
                    plan: premium.plan
                }
            })

            member = await newMem.save();
            await premium.deleteOne();

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "premium", "redeem_title")}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`${client.i18n.get(language, "premium", "redeem_desc", {
                    expires: expires,
                    plan: premium.plan
                })}`)
                .setColor(client.color)
                .setTimestamp()

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_invalid")}`)
            return interaction.editReply({ embeds: [embed] })
        }
    }
}