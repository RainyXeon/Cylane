const {
  PermissionsBitField,
  InteractionType,
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");

/**
 * @param {CommandInteraction} interaction
 */

const REGEX = [
  /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/,
  /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
  /^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|user\/(.*)\/playlist\/|playlist\/))(.*)$/,
  /^https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(track|album|playlist)\/(\d+)$/,
  /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/,
  /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/,
  /^https?:\/\/(?:www\.|secure\.|sp\.)?nicovideo\.jp\/watch\/([a-z]{2}[0-9]+)/,
];

module.exports = async (client, interaction) => {
  if (
    interaction.isCommand ||
    interaction.isContextMenuCommand ||
    interaction.isModalSubmit ||
    interaction.isChatInputCommand
  ) {
    if (!interaction.guild || interaction.user.bot) return;
    if (!client.is_db_connected)
      return client.logger.warn(
        "The database is not yet connected so this event will temporarily not execute. Please try again later!",
      );

    let LANGUAGE = client.i18n;
    let guildModel = await client.db.get(
      `language.guild_${interaction.guild.id}`,
    );

    if (guildModel) LANGUAGE = guildModel;
    else if (!guildModel) {
      await client.db.set(
        `language.guild_${interaction.guild.id}`,
        client.config.bot.LANGUAGE,
      );
      const newModel = await client.db.get(
        `language.guild_${interaction.guild.id}`,
      );
      LANGUAGE = newModel;
    }

    const language = LANGUAGE;

    let subCommandName = "";
    try {
      subCommandName = interaction.options.getSubcommand();
    } catch {}
    let subCommandGroupName = "";
    try {
      subCommandGroupName = interaction.options.getSubcommandGroup();
    } catch {}

    const command = client.slash.find((command) => {
      switch (command.name.length) {
        case 1:
          return command.name[0] == interaction.commandName;
        case 2:
          return (
            command.name[0] == interaction.commandName &&
            command.name[1] == subCommandName
          );
        case 3:
          return (
            command.name[0] == interaction.commandName &&
            command.name[1] == subCommandGroupName &&
            command.name[2] == subCommandName
          );
      }
    });

    // Push Function
    async function AutoCompletePush(url, choice) {
      const Random =
        client.config.lavalink.DEFAULT[
          Math.floor(Math.random() * client.config.lavalink.DEFAULT.length)
        ];
      const match = REGEX.some((match) => {
        return match.test(url) == true;
      });
      if (match == true) {
        choice.push({ name: url, value: url });
        await interaction.respond(choice).catch(() => {});
      } else {
        if (client.lavalink_using.length == 0) {
          choice.push({
            name: `${client.i18n.get(language, "music", "no_node")}`,
            value: `${client.i18n.get(language, "music", "no_node")}`,
          });
          return;
        }
        await client.manager.search(url || Random).then((result) => {
          for (let i = 0; i < 10; i++) {
            const x = result.tracks[i];
            choice.push({ name: x.title, value: x.uri });
          }
        });
        await interaction.respond(choice).catch(() => {});
      }
    }

    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      if (
        interaction.commandName == "play" ||
        interaction.commandName + command.name[1] == "playlist" + "add"
      ) {
        let choice = [];
        const url = interaction.options.get("search").value;
        return AutoCompletePush(url, choice);
      } else if (
        interaction.commandName + command.name[1] ==
        "playlist" + "edit"
      ) {
        let choice = [];
        const url = interaction.options.get("add").value;
        return AutoCompletePush(url, choice);
      }
    }

    if (!command) return;

    const msg_cmd = [
      `[COMMAND] ${command.name[0]}`,
      `${command.name[1] || ""}`,
      `${command.name[2] || ""}`,
      `used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`,
    ];

    client.logger.info(`${msg_cmd.join(" ")}`);

    if (command.owner && interaction.user.id != client.owner)
      return interaction.reply(
        `${client.i18n.get(language, "interaction", "owner_only")}`,
      );

    try {
      if (command.premium) {
        const user = client.premiums.get(interaction.user.id);
        if (!user || !user.isPremium) {
          const embed = new EmbedBuilder()
            .setAuthor({
              name: `${client.i18n.get(
                language,
                "nopremium",
                "premium_author",
              )}`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `${client.i18n.get(language, "nopremium", "premium_desc")}`,
            )
            .setColor(client.color)
            .setTimestamp();

          return interaction.reply({ content: " ", embeds: [embed] });
        }
      }
    } catch (err) {
      logger.error(err);
      return interaction.reply({
        content: `${client.i18n.get(language, "nopremium", "premium_error")}`,
      });
    }
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.SendMessages,
      )
    )
      return interaction.user.dmChannel.send(
        `${client.i18n.get(language, "interaction", "no_perms")}`,
      );
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.ViewChannel,
      )
    )
      return;
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.EmbedLinks,
      )
    )
      return interaction.reply(
        `${client.i18n.get(language, "interaction", "no_perms")}`,
      );
    if (!interaction.commandName == "help") {
      if (
        !interaction.guild.members.me.permissions.has(
          PermissionsBitField.Flags.Speak,
        )
      )
        return interaction.reply(
          `${client.i18n.get(language, "interaction", "no_perms")}`,
        );
      if (
        !interaction.guild.members.me.permissions.has(
          PermissionsBitField.Flags.Connect,
        )
      )
        return interaction.reply(
          `${client.i18n.get(language, "interaction", "no_perms")}`,
        );
      if (
        !interaction.guild.members.me.permissions.has(
          PermissionsBitField.Flags.ManageMessages,
        )
      )
        return interaction.reply(
          `${client.i18n.get(language, "interaction", "no_perms")}`,
        );
      if (
        !interaction.guild.members.me.permissions.has(
          PermissionsBitField.Flags.ManageChannels,
        )
      )
        return await interaction.reply(
          `${client.i18n.get(language, "interaction", "no_perms")}`,
        );
    }

    if (command.lavalink) {
      if (client.lavalink_using.length == 0)
        return interaction.reply(
          `${client.i18n.get(language, "music", "no_node")}`,
        );
    }

    if (!command) return;
    if (command) {
      try {
        command.run(interaction, client, language);
      } catch (error) {
        client.logger.log({
          level: "error",
          message: error,
        });
        return interaction.editReply({
          content: `${client.i18n.get(
            language,
            "interaction",
            "error",
          )}\n ${error}`,
          ephmeral: true,
        });
      }
    }
  }
};
