const { EmbedBuilder, Client } = require("discord.js");
const GLang = require("../../plugins/schemas/language.js");


 module.exports = async (client, player) => {
	client.logger.info(`Player Destroy in @ ${player.guildId}`);
	const channel = client.channels.cache.get(player.textId);
	if (!channel) return;

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