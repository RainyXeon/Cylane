const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const moment = require('moment');
const Premium = require("../../plugins/schemas/premium.js");
const Redeem = require("../../plugins/schemas/redeem.js");

module.exports = {
    name: ["redeem"],
    description: "Redeem your premium!",
    category: "Premium",
    premium: false,
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
            const expires = moment(premium.expiresAt).format('do/MMMM/YYYY (HH:mm:ss)')
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.i18n.get(language, "premium", "redeem_title")}`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`${client.i18n.get(language, "premium", "redeem_desc", {
                    expires: expires,
                    plan: premium.plan
                })}`)
                .setColor(client.color)
                .setTimestamp()

            if (!member) {
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
                return newMem.save().then(async () => {
                    await interaction.editReply({ embeds: [embed] });
                    await premium.deleteOne();
                }).catch((e) => client.logger.log({ level: 'error', message: e }))
            }
  
            member.isPremium = true
            member.premium.redeemedBy.push(interaction.user)
            member.premium.redeemedAt = Date.now()
            member.premium.expiresAt = premium.expiresAt
            member.premium.plan = premium.plan

            member = await member.save();
            await premium.deleteOne();

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_invalid")}`)
            return interaction.editReply({ embeds: [embed] })
        }
    }
}