const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: ["playlist", "delete"],
  description: "Delete a playlist",
  category: "Playlist",
  options: [
    {
      name: "name",
      description: "The name of the playlist",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });

    const value = interaction.options.getString("name");
    const Plist = value.replace(/_/g, " ");

    const fullList = await client.db.get("playlist");

    const filter_level_1 = Object.keys(fullList).filter(function (key) {
      return (
        fullList[key].owner == interaction.user.id &&
        fullList[key].name == Plist
      );
    });

    const playlist = await client.db.get(`playlist.${filter_level_1[0]}`);

    if (!playlist)
      return interaction.editReply(
        `${client.i18n.get(language, "playlist", "delete_notfound")}`,
      );
    if (playlist.owner !== interaction.user.id)
      return interaction.editReply(
        `${client.i18n.get(language, "playlist", "delete_owner")}`,
      );
    if (playlist.id == "thedreamvastghost0923849084") return;

    await client.db.delete(`playlist.pid_${filter_level_1}`);
    const embed = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(language, "playlist", "delete_deleted", {
          name: Plist,
        })}`,
      )
      .setColor(client.color);
    interaction.editReply({ embeds: [embed] });
  },
};
