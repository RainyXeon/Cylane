const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: ["profile"],
  description: "View your premium profile!",
  category: "Premium",
  premium: true,
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });

    const PremiumPlan = await client.db.get(
      `premium.user_${interaction.user.id}`,
    );
    const expires = moment(PremiumPlan.expiresAt).format(
      "do/MMMM/YYYY (HH:mm:ss)",
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.i18n.get(language, "premium", "profile_author")}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `${client.i18n.get(language, "premium", "profile_desc", {
          user: interaction.user.tag,
          plan: PremiumPlan.plan,
          expires: expires,
        })}`,
      )
      .setColor(client.color)
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};
