const { EmbedBuilder } = require('discord.js');
const Premium = require("../../../plugins/schemas/premium.js");

module.exports = {
    name: "premium-remove",
    description: "Remove premium from members!",
    category: "Premium",
    owner: true,
    usage: "<mention or id>",
    aliases: ["prm"],

    run: async (client, message, args, language, prefix) => {
        let db

        const mentions = message.mentions.users.first()

        const id = args[0] && mentions ? undefined : args[0]

        if (!id && !mentions) return message.channel.send({ content: `${client.i18n.get(language, "premium", "remove_no_params",)}` });
        if (id && mentions) return message.channel.send({ content: `${client.i18n.get(language, "premium", "remove_only_params",)}` });

        if (id && !mentions) db = await Premium.findOne({ Id: id });
        if (mentions && !id) db = await Premium.findOne({ Id:  mentions.id });

        if (!db) return message.channel.send({ content: `${client.i18n.get(language, "premium", "remove_404", { userid: id })}` })

        if (db.isPremium) {

          db.isPremium = false
          db.premium.redeemedBy = []
          db.premium.redeemedAt = null
          db.premium.expiresAt = null
          db.premium.plan = null

          const done = await db.save().catch(() => {})

          await client.premiums.set(id || mentions.id, done)

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "premium", "remove_desc", {
                    user: mentions
                })}`)
                .setColor(client.color)

            message.channel.send({ embeds: [embed] });

        } else {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "premium", "remove_already", {
                    user: mentions
                })}`)
                .setColor(client.color)

            message.channel.send({ embeds: [embed] });
        }
    }
}