const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "redeem",
    description: "Redeem your premium!",
    category: "Premium",
    usage: "<input>",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
        
        
        const input = args[0]
        
        let member = await client.db.get(`premium.user_${message.author.id}`)

        if (member && member.isPremium) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_already")}`)
            return message.channel.send({ embeds: [embed] });
        }
  
        const premium = await client.db.get(`code.pmc_${input.toUpperCase()}`)
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

            const new_data = {
                id: message.author.id,
                isPremium: true,
                redeemedBy: message.author,
                redeemedAt: Date.now(),
                expiresAt: premium.expiresAt,
                plan: premium.plan
            }
            await client.db.set(`premium.guild_${new_data.id}`, new_data)
            await message.channel.send({ embeds: [embed] });
            await client.db.delete(`code.pmc_${input.toUpperCase()}`)
            return client.premiums.set(message.author.id, new_data)
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_invalid")}`)
            return message.channel.send({ embeds: [embed] })
        }
    }
}