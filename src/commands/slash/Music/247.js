const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: ["247"],
  description: "24/7 in voice channel",
  category: "Music",
  run: async (interaction, client, language) => {
    await interaction.deferReply({ ephemeral: false });
    const options = interaction.options.getString("type");
    const msg = await interaction.editReply(
      `${client.i18n.get(language, "music", "247_loading")}`,
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

    let data = await client.db.get(
      `autoreconnect.guild_${interaction.guild.id}`,
    );

    if (data) {
      await client.db.delete(`autoreconnect.guild_${interaction.guild.id}`);
      const on = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "247_off")}`)
        .setColor(client.color);
      msg.edit({ content: " ", embeds: [on] });
    } else if (!data) {
      await client.db.set(`autoreconnect.guild_${interaction.guild.id}`, {
        guild: player.guildId,
        text: player.textId,
        voice: player.voiceId,
      });

      const on = new EmbedBuilder()
        .setDescription(`${client.i18n.get(language, "music", "247_on")}`)
        .setColor(client.color);
      return msg.edit({ content: " ", embeds: [on] });
    }
  },
};
