const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  version,
} = require("discord.js");
const ms = require("pretty-ms");

module.exports = {
  name: ["developer"],
  description: "Shows the developer information of the Bot (Credit)",
  category: "Info",
  run: async (interaction, client, language) => {
    let command_array = [];
    await interaction.deferReply({ ephemeral: false });
    const command = await client.slash;
    command.map((c) => {
      command_array.push({
        name: c.name.join(" "),
        description: c.description,
        category: c.category,
        code: c.name.join(""),
      });
    });
    console.log(command_array);
    const xeondex = new EmbedBuilder()
      .setTitle(`${client.i18n.get(language, "info", "dev_title")}`)
      .setDescription(`${client.i18n.get(language, "info", "dev_desc")}`)
      .setFooter({ text: `${client.i18n.get(language, "info", "dev_foot")}` })
      .setColor(client.color);

    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Github (Adivise)")
          .setStyle("Link")
          .setURL("https://github.com/Adivise"),
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Github (XeonDex)")
          .setStyle("Link")
          .setURL("https://github.com/XeonE52680v3"),
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Support Server")
          .setStyle("Link")
          .setURL("https://discord.com/invite/xHvsCMjnhU"),
      );

    await interaction.editReply({ embeds: [xeondex], components: [row1] });
  },
};
