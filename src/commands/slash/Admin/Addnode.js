const { EmbedBuilder } = require('discord.js');
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = { 
  name: ["sudo", "addnode"],
  description: "Add backup to the lavalink client!",
  category: "Admin",
  owner: true,
  run: async (interaction, client, language) => {

    function parseBoolean(value){
      if (typeof(value) === 'string'){
          value = value.trim().toLowerCase();
      }
      switch(value){
          case true:
          case "true":
              return true;
          default:
              return false;
      }
    }

    const url_text = new TextInputBuilder()
      .setLabel("Url ?")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Ex: lavalink2.devamop.in:8830")
      .setCustomId("url")
      .setRequired(true)
    const name_text = new TextInputBuilder()
        .setLabel("Name ?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex: my_node")
        .setCustomId("name")
        .setRequired(false)
    const auth_text = new TextInputBuilder()
        .setLabel("Password ?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex: DevamOP")
        .setCustomId("auth")
        .setRequired(true)
    const secure_text = new TextInputBuilder()
        .setLabel("Secure ? (Is your node have ssl?)")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex: true")
        .setCustomId("secure")
        .setRequired(false)

    const modal = new ModalBuilder()
        .setCustomId("node_info")
        .setTitle("New node information:")
        .setComponents(
            new ActionRowBuilder().addComponents(url_text),
            new ActionRowBuilder().addComponents(name_text),
            new ActionRowBuilder().addComponents(auth_text),
            new ActionRowBuilder().addComponents(secure_text),
        )

    await interaction.showModal(modal);

    const collector = await interaction.awaitModalSubmit({ 
        time: 120000,
        filter: i => i.user.id === interaction.user.id 
    }).catch(error => {
        client.logger.info({ level: "error", message: error });
        return null;
    });

    if (collector) {
      const msg = await collector.reply("Success Submit...")

      const new_node_info = {
        name: collector.fields.getTextInputValue("name") ? collector.fields.getTextInputValue("name") : collector.fields.getTextInputValue("url"),
        url: collector.fields.getTextInputValue("url"),
        auth: collector.fields.getTextInputValue("auth"),
        secure: collector.fields.getTextInputValue("secure") ? parseBoolean(collector.fields.getTextInputValue("secure")) : false
      }

      console.log(new_node_info)

      await msg.edit("Now adding node....")

      client.manager.shoukaku.addNode(new_node_info)

      console.log(client.manager.shoukaku.nodes)

      await msg.edit("Add node successully!")
    }


  }
};