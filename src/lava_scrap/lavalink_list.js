const { SlashPage } = require("../structures/LavalinkPage")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version, ApplicationCommandOptionType } = require('discord.js');

async function LavalinkList(interaction, client, language) {
  const string_array = []

  for (let i = 0; i < client.lavalink_list.length; i++) {
    const element = client.lavalink_list[i];
    if (element.host == client.lavalink_using[0].host) {
      string_array.push(`\`${i + 1}: [USING] | ${element.online ? "🟢" : "🔴"} | ws://${element.host}:${element.port}/v3/websocket\``)
    } else {
      string_array.push(`\`${i + 1}: ${element.online ? "🟢" : "🔴"} | ws://${element.host}:${element.port}/v3/websocket\``)
    }
  }

  let pagesNum = Math.ceil(client.lavalink_list.length / 15);

  const pages = [];
  for (let i = 0; i < pagesNum; i++) {
      const str = string_array.slice(i * 15, i * 15 + 15).join(`\n`);

      const embed = new EmbedBuilder()
        .setTitle(`${client.i18n.get(language, "utilities", "page_title")}`)
        .setDescription(str == '' ? '  Nothing' : str)
        .setTimestamp()
        .setColor(client.color);

      pages.push(embed);
  }

  if (pages.length == pagesNum && string_array.length > 15) SlashPage(client, interaction, pages, 60000, string_array.length, language);
  else return interaction.editReply({ embeds: [pages[0]] });
}

module.exports = { LavalinkList }