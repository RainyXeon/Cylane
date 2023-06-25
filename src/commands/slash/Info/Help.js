const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: ["help"],
    description: "Displays all commands that the bot has.",
    category: "Info",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const category = readdirSync("./src/commands/slash")

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.members.me.displayName} Help Command!`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setDescription(`The bot prefix is: \`/\``)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setColor(client.color)

        const row = new ActionRowBuilder()
            .addComponents([
                new StringSelectMenuBuilder()
                    .setCustomId("help-category")
                    .setPlaceholder(`${client.i18n.get(language, "utilities", "help_desc")}`)
                    .setMaxValues(1)
                    .setMinValues(1)
                    /// Map the category to the select menu
                    .setOptions(category.map(category => {
                        return new StringSelectMenuOptionBuilder()
                            .setLabel(category)
                            .setValue(category)
                        }
                    ))
                ])

            interaction.editReply({ embeds: [embed], components: [row] }).then(async (msg) => {
                let filter = (i) => (i.isStringSelectMenu()) && i.user && i.message.author.id == client.user.id;
                let collector = await msg.createMessageComponentCollector({ 
                    filter,
                    time: 60000 
                });
                collector.on('collect', async (m) => {
                    if(m.isStringSelectMenu()) {
                        if(m.customId === "help-category") {
                            await m.deferUpdate();
                            let [directory] = m.values;

                            const cmd = client.slash.filter(c => c.name === "music")

                            const embed = new EmbedBuilder()
                                .setAuthor({ name: `${interaction.guild.members.me.displayName} Help Command!`, iconURL: interaction.guild.iconURL({ dynamic: true })})
                                .setDescription(`The bot prefix is: \`/\``)
                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                .setColor(client.color)
                                .addFields({ name: `❯  ${directory.toUpperCase()} [${client.slash.filter(c => c.category === directory).size}]`, value: `${client.slash.filter(c => c.category === directory).map(c => `\`${c.name.at(-1)}\``).join(", ")}`, inline: false })
                                .setFooter({ text: `© ${interaction.guild.members.me.displayName} | Total Commands: ${client.slash.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

                            msg.edit({ embeds: [embed] });
                    }
                }
            });

            collector.on('end', async (collected, reason) => {
                if(reason === 'time') {
                    const timed = new EmbedBuilder()
                    .setDescription(`${client.i18n.get(language, "utilities", "help_timeout", {
                        prefix: "/"
                    })}`)
                    .setColor(client.color)

                    msg.edit({ embeds: [timed], components: [] });
                }
            });
        })
    }
}