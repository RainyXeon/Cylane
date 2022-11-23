const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Premium = require("../../plugins/schemas/premium.js");

module.exports = {
    name: ["premium", "remove"],
    description: "Remove premium from members!",
    category: "Premium",
    premium: false,
    options: [
        {
            name: "target",
            description: "Mention a user want to remove!",
            required: true,
            type: ApplicationCommandOptionType.User,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });

        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });
        
        const mentions = interaction.options.getUser("target");
        
        const db = await Premium.findOne({ Id: mentions.id });

        if (db.isPremium) {

          db.isPremium = false
          db.premium.redeemedBy = []
          db.premium.redeemedAt = null
          db.premium.expiresAt = null
          db.premium.plan = null

          const done = await db.save().catch(() => {})

          await client.premiums.set(interaction.user.id, done)

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "premium", "remove_desc", {
                    user: mentions
                })}`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });

        } else {
            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "premium", "remove_already", {
                    user: mentions
                })}`)
                .setColor(client.color)

            interaction.editReply({ embeds: [embed] });
        }
    }
}