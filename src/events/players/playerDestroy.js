const { EmbedBuilder, Client } = require("discord.js");
const GLang = require("../../plugins/schemas/language.js");
const db  = require("../../plugins/schemas/autoreconnect")

 module.exports = async (client, player) => {
	const guild = await client.guilds.cache.get(player.guildId)
	client.logger.info(`Player Destroy in @ ${guild.name} / ${player.guildId}`);
	if (client.websocket) client.websocket.send(JSON.stringify({ op: "player_destroy", guild: player.guildId }))
	const channel = client.channels.cache.get(player.textId);
	let data = await db.findOne({ guild: player.guildId })

	if (!channel) return;

	if (player.state == 5 && data) {
		await client.manager.createPlayer({
			guildId: data.guild,
			voiceId: data.voice,
			textId: data.text,
			deaf: true,
		});
	}

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
}