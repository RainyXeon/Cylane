const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const Premium = require("../../../plugins/schemas/premium.js");
const Redeem = require("../../../plugins/schemas/redeem.js");

module.exports = {
    name: "redeem",
    description: "Redeem your premium!",
    category: "Premium",
    usage: "<input>",
    aliases: [],

    run: async (client, message, args, language, prefix) => {
        
        
        const input = args[0]
        
        let member = await Premium.findOne({ Id: message.author.id })

        if (member && member.isPremium) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_already")}`)
            return message.channel.send({ embeds: [embed] });
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
                    Id: message.author.id,
                    isPremium: true,
                    premium: {
                        redeemedBy: message.author,
                        redeemedAt: Date.now(),
                        expiresAt: premium.expiresAt,
                        plan: premium.plan
                    }
                })
                return newMem.save().then(async () => {
                    await message.channel.send({ embeds: [embed] });
                    await premium.deleteOne();
                }).catch((e) => client.logger.log({ level: 'error', message: e }))
            }
  
            member.isPremium = true
            member.premium.redeemedBy.push(message.author)
            member.premium.redeemedAt = Date.now()
            member.premium.expiresAt = premium.expiresAt
            member.premium.plan = premium.plan

            member = await member.save();
            await client.premiums.set(message.author.id, member)
            await premium.deleteOne();

            return message.channel.send({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${client.i18n.get(language, "premium", "redeem_invalid")}`)
            return message.channel.send({ embeds: [embed] })
        }
    }
}