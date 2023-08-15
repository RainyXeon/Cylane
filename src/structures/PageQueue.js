const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

const SlashPage = async (
  client,
  interaction,
  pages,
  timeout,
  queueLength,
  queueDuration,
  language,
) => {
  if (!interaction && !interaction.channel)
    throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");

  const row1 = new ButtonBuilder()
    .setCustomId("back")
    .setLabel("⬅")
    .setStyle("Primary");
  const row2 = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("➡")
    .setStyle("Primary");
  const row = new ActionRowBuilder().addComponents(row1, row2);

  let page = 0;
  const curPage = await interaction.editReply({
    embeds: [
      pages[page].setFooter({
        text: `${client.i18n.get(language, "music", "queue_footer", {
          page: page + 1,
          pages: pages.length,
          queue_lang: queueLength,
          duration: queueDuration,
        })}`,
      }),
    ],
    components: [row],
    allowedMentions: { repliedUser: false },
  });
  if (pages.length == 0) return;

  const filter = (m) => m.user.id === interaction.user.id;
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (interaction) => {
    if (!interaction.deferred) await interaction.deferUpdate();
    if (interaction.customId === "back") {
      page = page > 0 ? --page : pages.length - 1;
    } else if (interaction.customId === "next") {
      page = page + 1 < pages.length ? ++page : 0;
    }
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `${client.i18n.get(language, "music", "queue_footer", {
            page: page + 1,
            pages: pages.length,
            queue_lang: queueLength,
            duration: queueDuration,
          })}`,
        }),
      ],
      components: [row],
    });
  });

  collector.on("end", () => {
    const disabled = new ActionRowBuilder().addComponents(
      row1.setDisabled(true),
      row2.setDisabled(true),
    );
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `${client.i18n.get(language, "music", "queue_footer", {
            page: page + 1,
            pages: pages.length,
            queue_lang: queueLength,
            duration: queueDuration,
          })}`,
        }),
      ],
      components: [disabled],
    });
  });

  return curPage;
};

const SlashPlaylist = async (
  client,
  interaction,
  pages,
  timeout,
  queueLength,
  language,
) => {
  if (!interaction && !interaction.channel)
    throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");

  const row1 = new ButtonBuilder()
    .setCustomId("back")
    .setLabel("⬅")
    .setStyle("Primary");
  const row2 = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("➡")
    .setStyle("Primary");
  const row = new interactionActionRow().addComponents(row1, row2);

  let page = 0;
  const curPage = await interaction.editReply({
    embeds: [
      pages[page].setFooter({
        text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
          page: page + 1,
          pages: pages.length,
          songs: queueLength,
        })}`,
      }),
    ],
    components: [row],
    allowedMentions: { repliedUser: false },
  });
  if (pages.length == 0) return;

  const filter = (m) => m.user.id === interaction.user.id;
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (interaction) => {
    if (!interaction.deferred) await interaction.deferUpdate();
    if (interaction.customId === "back") {
      page = page > 0 ? --page : pages.length - 1;
    } else if (interaction.customId === "next") {
      page = page + 1 < pages.length ? ++page : 0;
    }
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
            page: page + 1,
            pages: pages.length,
            songs: queueLength,
          })}`,
        }),
      ],
      components: [row],
    });
  });
  collector.on("end", () => {
    const disabled = new ActionRowBuilder().addComponents(
      row1.setDisabled(true),
      row2.setDisabled(true),
    );
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
            page: page + 1,
            pages: pages.length,
            songs: queueLength,
          })}`,
        }),
      ],
      components: [disabled],
    });
  });
  return curPage;
};

const NormalPage = async (
  client,
  message,
  pages,
  timeout,
  queueLength,
  queueDuration,
  language,
) => {
  if (!message && !message.channel) throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");

  const row1 = new ButtonBuilder()
    .setCustomId("back")
    .setLabel("⬅")
    .setStyle("Primary");
  const row2 = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("➡")
    .setStyle("Primary");
  const row = new ActionRowBuilder().addComponents(row1, row2);

  let page = 0;
  const curPage = await message.channel.send({
    embeds: [
      pages[page].setFooter({
        text: `${client.i18n.get(language, "music", "queue_footer", {
          page: page + 1,
          pages: pages.length,
          queue_lang: queueLength,
          duration: queueDuration,
        })}`,
      }),
    ],
    components: [row],
    allowedMentions: { repliedUser: false },
  });
  if (pages.length == 0) return;

  const filter = (interaction) =>
    interaction.user.id === message.author.id
      ? true
      : false && interaction.deferUpdate();
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (interaction) => {
    if (!interaction.deferred) await interaction.deferUpdate();
    if (interaction.customId === "back") {
      page = page > 0 ? --page : pages.length - 1;
    } else if (interaction.customId === "next") {
      page = page + 1 < pages.length ? ++page : 0;
    }
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `${client.i18n.get(language, "music", "queue_footer", {
            page: page + 1,
            pages: pages.length,
            queue_lang: queueLength,
            duration: queueDuration,
          })}`,
        }),
      ],
      components: [row],
    });
  });
  collector.on("end", () => {
    const disabled = new ActionRowBuilder().addComponents(
      row1.setDisabled(true),
      row2.setDisabled(true),
    );
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `${client.i18n.get(language, "music", "queue_footer", {
            page: page + 1,
            pages: pages.length,
            queue_lang: queueLength,
            duration: queueDuration,
          })}`,
        }),
      ],
      components: [disabled],
    });
  });
  return curPage;
};

const NormalPlaylist = async (
  client,
  message,
  pages,
  timeout,
  queueLength,
  language,
) => {
  if (!message && !message.channel) throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");

  const row1 = new ButtonBuilder()
    .setCustomId("back")
    .setLabel("⬅")
    .setStyle("Primary");
  const row2 = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("➡")
    .setStyle("Primary");
  const row = new ActionRowBuilder().addComponents(row1, row2);

  let page = 0;
  const curPage = await message.channel.send({
    embeds: [
      pages[page].setFooter({
        text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
          page: page + 1,
          pages: pages.length,
          songs: queueLength,
        })}`,
      }),
    ],
    components: [row],
    allowedMentions: { repliedUser: false },
  });
  if (pages.length == 0) return;

  const filter = (interaction) =>
    interaction.user.id === message.author.id
      ? true
      : false && interaction.deferUpdate();
  const collector = await curPage.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (interaction) => {
    if (!interaction.deferred) await interaction.deferUpdate();
    if (interaction.customId === "back") {
      page = page > 0 ? --page : pages.length - 1;
    } else if (interaction.customId === "next") {
      page = page + 1 < pages.length ? ++page : 0;
    }
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
            page: page + 1,
            pages: pages.length,
            songs: queueLength,
          })}`,
        }),
      ],
      components: [row],
    });
  });
  collector.on("end", () => {
    const disabled = new ActionRowBuilder().addComponents(
      row1.setDisabled(true),
      row2.setDisabled(true),
    );
    curPage.edit({
      embeds: [
        pages[page].setFooter({
          text: `${client.i18n.get(language, "playlist", "view_embed_footer", {
            page: page + 1,
            pages: pages.length,
            songs: queueLength,
          })}`,
        }),
      ],
      components: [disabled],
    });
  });
  return curPage;
};

module.exports = { SlashPage, SlashPlaylist, NormalPage, NormalPlaylist };
