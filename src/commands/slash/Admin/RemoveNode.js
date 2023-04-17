const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const desc_data = []

module.exports = { 
  name: ["sudo", "remove_node"],
  description: "Remove the lavalink server!",
  category: "Admin",
  owner: true,
  options: [
    {
        name: "name",
        description: "The song link or name",
        type: ApplicationCommandOptionType.String
    }
  ],
  run: async (interaction, client, language) => {
    const value = await interaction.options.getString("name")
    if (client.manager.shoukaku.nodes.get(value)) {
      if (client.manager.shoukaku.nodes.size == 1) return interaction.reply("You can't remove when only 1 node running!")
      const old_nodes = client.manager.shoukaku.nodes.get(value)
      console.log(old_nodes)
      await client.manager.shoukaku.removeNode(value)
      return interaction.reply("Removed successfully!")
    }

    console.log(client.manager.shoukaku.nodes.size)

    for(const [key, value] of client.manager.shoukaku.nodes) {
      desc_data.push(`Name: ${key}, URL: ${value.url}`)
    }

    const embed = new EmbedBuilder()
      .setDescription(desc_data.join(`\n`) || "No node avalible!")
      .setColor(client.color)
      
    await interaction.reply({ embeds: [embed] })
    
    
  }
};