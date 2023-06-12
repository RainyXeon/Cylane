const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const moment = require('moment');

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
        
        let member = await client.db.get(`premium.user_${interaction.user.id}`)

        if (member && member.isPremium) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_already")}`)
            return interaction.editReply({ embeds: [embed] });
        }
  
        const premium = await client.db.get(`code.pmc_${input}`)

        if (input == "pmc_thedreamvastghost") return interaction.editReply("WU9VIENBTidUIERPIFRISVMgRk9SIEZSRUUgUFJFTUlVTQotIFJhaW55WGVvbiAt") 

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

            const data = {
                id: interaction.user.id,
                isPremium: true,
                redeemedBy: interaction.user,
                redeemedAt: Date.now(),
                expiresAt: premium.expiresAt,
                plan: premium.plan
            }

            if (!member) {
                await client.db.set(`premium.user_${interaction.user.id}`, data)
                await interaction.editReply({ embeds: [embed] });
                return client.premiums.set(interaction.user.id, data)
                await client.db.delete(`code.pmc_${input.toUpperCase()}`)
            }

            client.db.set(`premium.user_${interaction.user.id}.isPremium`, true)
            client.db.push(`premium.user_${interaction.user.id}.redeemedBy`, interaction.user)
            client.db.set(`premium.user_${interaction.user.id}.redeemedAt`, Date.now())
            client.db.set(`premium.user_${interaction.user.id}.expiresAt`, premium.expiresAt)
            client.db.set(`premium.user_${interaction.user.id}.plan`, premium.plan)


            await client.premiums.set(interaction.user.id, data)
            await client.db.delete(`code.pmc_${input.toUpperCase()}`)

            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_invalid")}`)
            return interaction.editReply({ embeds: [embed] })
        }
    }
}