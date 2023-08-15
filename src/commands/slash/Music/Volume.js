const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

// Main code
module.exports = {
  name: ["volume"],
  description: "Adjusts the volume of the bot.",
  category: "Music",
  options: [
    {
      name: "amount",
      description: "The amount of volume to set the bot to.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });
    const value = interaction.options.getNumber("amount");
    const msg = await interaction.editReply(
      `${client.i18n.get(language, "music", "volume_loading")}`,
    );

    const player = client.manager.players.get(interaction.guild.id);
    if (!player)
      return msg.edit(`${client.i18n.get(language, "noplayer", "no_player")}`);
    const { channel } = interaction.member.voice;
    if (
      !channel ||
      interaction.member.voice.channel !==
        interaction.guild.members.me.voice.channel
    )
      return msg.edit(`${client.i18n.get(language, "noplayer", "no_voice")}`);

    if (!value)
      return msg.edit(
        `${client.i18n.get(language, "music", "volume_usage", {
          volume: player.volume,
        })}`,
      );
    if (Number(value) <= 0 || Number(value) > 100)
      return msg.edit(
        `${client.i18n.get(language, "music", "volume_invalid")}`,
      );

    await player.setVolume(Number(value));

    const changevol = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(language, "music", "volume_msg", {
          volume: value,
        })}`,
      )
      .setColor(client.color);

    msg.edit({ content: " ", embeds: [changevol] });
  },
};
