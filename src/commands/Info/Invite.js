const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
    name: "invite",
    description: "Shows the invite information of the Bot",
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
                const invite = new EmbedBuilder()
                    .setTitle(`${client.i18n.get(language, "info", "inv_title" , { username: client.user.username })}`)
                    .setDescription(`${client.i18n.get(language, "info", "inv_desc", { username: client.user.username })}`)
                    .addFields([
                        { name: 'Nanospace', value: 'https://github.com/Adivise/NanoSpacePlus', inline: false }
                    ])
                    .setTimestamp()
                    .setColor(client.color);

                const row2 = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Invite Me")
                        .setStyle("Link")
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
                  
                await interaction.editReply({ embeds: [invite], components: [row2] });       
    }
};