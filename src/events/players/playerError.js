const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player, track, payload) => {
  const guild = await client.guilds.cache.get(player.guildId)

  client.logger.error(payload.error);

  const channel = client.channels.cache.get(player.textChannel);
  if (!channel) return;

  let guildModel = await client.db.get(`language.guild_${channel.guild.id}`)
  if (!guildModel) {
      guildModel = await client.db.set(`language.guild_${channel.guild.id}`, "en")
  }

  const language = guildModel;

  /////////// Update Music Setup ///////////

  await client.UpdateMusic(player);

  /////////// Update Music Setup ///////////

  const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${client.i18n.get(language, "player", "error_desc")}`);

  channel.send({ embeds: [embed] });

  client.logger.error(`Track Error in ${guild.name} / ${player.guildId}. Auto-Leaved!`);
  await player.destroy(guild);
  if (client.websocket) client.websocket.send(JSON.stringify({ op: "player_destroy", guild: player.guildId }))

}