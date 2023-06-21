const { ActionRowBuilder, ButtonBuilder } = require('discord.js')

const SlashPage = async (client, interaction, pages, timeout, language) => {
    if (!interaction && !interaction.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');

    const row1 = new ButtonBuilder()
        .setCustomId('back')
        .setLabel('⬅')
        .setStyle('Primary')
    const row2 = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡')
        .setStyle('Primary')
    const row = new ActionRowBuilder()
        .addComponents(row1, row2)

    let page = 0;
    const curPage = await interaction.editReply({ embeds: [pages[page].setFooter({ text: `${client.i18n.get(language, "utilities", "page_footer", {
      page: page + 1,
      pages: pages.length,
    })}` })], components: [row], allowedMentions: { repliedUser: false } });
    if(pages.length == 0) return;

    const filter = (m) => m.user.id === interaction.user.id;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
        if(!interaction.deferred) await interaction.deferUpdate();
        if (interaction.customId === 'back') {
            page = page > 0 ? --page : pages.length - 1;
        } else if (interaction.customId === 'next') {
            page = page + 1 < pages.length ? ++page : 0;
        }
        curPage.edit({ embeds: [pages[page].setFooter({ text: `${client.i18n.get(language, "utilities", "page_footer", {
          page: page + 1,
          pages: pages.length,
        })}` })], components: [row] })
    });

    collector.on('end', () => {
        const disabled = new ActionRowBuilder()
            .addComponents(row1.setDisabled(true), row2.setDisabled(true))
        curPage.edit({ embeds: [pages[page].setFooter({ text: `${client.i18n.get(language, "utilities", "page_footer", {
          page: page + 1,
          pages: pages.length,
        })}` })], components: [disabled] })
    });

    return curPage;
};

module.exports = { SlashPage }