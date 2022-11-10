const { EmbedBuilder, Client } = require("discord.js");
const GLang = require("../../plugins/schemas/language.js");
const db  = require("../../plugins/schemas/autoreconnect")

 module.exports = async (client, player) => {
	client.logger.info(`Player Destroy in @ ${player.guildId}`);
	const channel = client.channels.cache.get(player.textId);
	let data = await db.findOne({ guild: player.guildId })
	if (!channel) return;

	if (player.state == 5 && player.twentyFourSeven && data) {
		await client.manager.createPlayer({
			guildId: data.guild,
			voiceId: data.voice,
			textId: data.text,
			deaf: true,
		});
	}

	if (player.twentyFourSeven) return;

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