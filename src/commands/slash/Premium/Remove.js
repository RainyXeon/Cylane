const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: ["premium", "remove"],
  description: "Remove premium from members!",
  category: "Premium",
  owner: true,
  options: [
    {
      name: "target",
      description: "Mention a user want to remove!",
      required: false,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "id",
      description: "The user id you want to remove!",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (interaction, client, language) => {
    let db;

    await interaction.deferReply({ ephemeral: false });

    const mentions = interaction.options.getUser("target");

    const id = interaction.options.getString("id");

    if (!id && !mentions)
      return interaction.editReply({
        content: `${client.i18n.get(language, "premium", "remove_no_params")}`,
      });
    if (id && mentions)
      return interaction.editReply({
        content: `${client.i18n.get(
          language,
          "premium",
          "remove_only_params",
        )}`,
      });
    if (id && !mentions) db = await client.db.get(`premium.user_${id}`);
    if (mentions && !id)
      db = await client.db.get(`premium.user_${mentions.id}`);

    if (!db)
      return interaction.editReply({
        content: `${client.i18n.get(language, "premium", "remove_404", {
          userid: id,
        })}`,
      });

    if (db.isPremium) {
      const data = {
        id: id || mentions.id,
        isPremium: false,
        redeemedAt: null,
        expiresAt: null,
        plan: null,
      };

      await client.db.set(`premium.user_${data.id}`, data);

      await client.premiums.set(id || mentions.id, data);

      const embed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "premium", "remove_desc", {
            user: mentions,
          })}`,
        )
        .setColor(client.color);

      interaction.editReply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setDescription(
          `${client.i18n.get(language, "premium", "remove_already", {
            user: mentions,
          })}`,
        )
        .setColor(client.color);

      interaction.editReply({ embeds: [embed] });
    }
  },
};
