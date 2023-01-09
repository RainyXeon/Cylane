const { EmbedBuilder, Client } = require("discord.js");
const GLang = require("../../plugins/schemas/language.js");
const db = require("../../plugins/schemas/autoreconnect")

 module.exports = async (client, player) => {
	const guild = await client.guilds.cache.get(player.guildId)
	client.logger.info(`Player End in @ ${guild.name} / ${player.guildId}`);
	let data = await db.findOne({ guild: player.guildId })
	const channel = client.channels.cache.get(player.textChannel);
	if (!channel) return;

	if (data) return;

	if (player.queue.length) return

	let guildModel = await GLang.findOne({
	  guild: channel.guild.id,
	});
	if (!guildModel) {
	  guildModel = await GLang.create({
		guild: channel.guild.id,
		language: "en",
	  });
	}

	const { language } = guildModel;

		/////////// Update Music Setup ///////////

		await client.UpdateMusic(player);

		/////////// Update Music Setup ///////////

	const embed = new EmbedBuilder()
		.setColor(client.color)
		.setDescription(`${client.i18n.get(language, "player", "queue_end_desc")}`);

	if(channel) channel.send({ embeds: [embed] });
	player.destroy();
	if (client.websocket) client.websocket.send(JSON.stringify({ op: "player_destroy", guild: player.guildId }))
}