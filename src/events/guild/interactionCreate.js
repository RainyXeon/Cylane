const { PermissionsBitField, InteractionType, CommandInteraction, EmbedBuilder } = require("discord.js");
const GLang = require("../../plugins/schemas/language.js");
const Premium = require("../../plugins/schemas/premium.js");

 /**
  * @param {CommandInteraction} interaction
  */

module.exports = async(client, interaction) => {
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
    if (!interaction.guild || interaction.user.bot) return;

    let LANGUAGE = client.i18n;
    let guildModel = await GLang.findOne({ guild: interaction.guild.id });

    if(guildModel && guildModel.language) LANGUAGE = guildModel.language;
    const language = LANGUAGE;

    let subCommandName = "";
    try {
      subCommandName = interaction.options.getSubcommand();
    } catch { };
    let subCommandGroupName = "";
    try {
      subCommandGroupName = interaction.options.getSubcommandGroup();
    } catch { };

    const command = client.slash.find(command => {
      switch (command.name.length) {
        case 1: return command.name[0] == interaction.commandName;
        case 2: return command.name[0] == interaction.commandName && command.name[1] == subCommandName;
        case 3: return command.name[0] == interaction.commandName && command.name[1] == subCommandGroupName && command.name[2] == subCommandName;
      }
    });

    // Push Function
    async function AutoCompletePush(url, choice) {
      const Random = client.config.DEFAULT[Math.floor(Math.random() * client.config.DEFAULT.length)]
      const match = client.config.REGEX.some((match) => { return match.test(url) == true });
      if (match == true) {
        choice.push({ name: url, value: url })
        await interaction.respond(choice).catch(() => { });
      } else if (match == false) {
        await client.manager.search(url || Random).then(result => {
          for (let i = 0; i < 10; i++) {
            const x = result.tracks[i];
            choice.push({ name: x.title, value: x.uri }) 
          }
        })
        await interaction.respond(choice).catch(() => { });
      } else {
        choice.push({ name: url, value: url })
        await interaction.respond(choice).catch(() => { });
      }
    }

    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      if (
        interaction.commandName == "play" ||
        interaction.commandName + command.name[1] == "playlist" + "add" 
      ) {
        let choice = []
        const url = interaction.options.get("search").value
        return AutoCompletePush(url, choice)
      } else if (
        interaction.commandName + command.name[1] == "playlist" + "edit"
      ) {
        let choice = []
        const url = interaction.options.get("add").value
        return AutoCompletePush(url, choice)
        
      }
    }

    if (!command) return;

    const msg_cmd = [
      `[COMMAND] ${command.name[0]}`,
      `${command.name[1] || ""}`,
      `${command.name[2] || ""}`,
      `used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`,
    ]

    client.logger.info(`${msg_cmd.join(" ")}`);

    const user = interaction.client.premiums.get(interaction.user.id)

    try {
      if (command.premium && !user.isPremium) {
        const embed = new EmbedBuilder()
          .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premium_author")}`, iconURL: client.user.displayAvatarURL() })
          .setDescription(`${client.i18n.get(language, "nopremium", "premium_desc")}`)
          .setColor(client.color)
          .setTimestamp()
  
        return interaction.reply({ content: " ", embeds: [embed] });
      }
    } catch (err) {
        console.log(err)
        interaction.editReply({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
    }

    if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.user.dmChannel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);
    if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
    if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
    if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
    if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
    if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
    if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);

    if (!command) return;
    if (command) {
      try {
          command.run(interaction, client, language);
      } catch (error) {
        client.logger.log({
          level: 'error',
          message: error
        })
        await interaction.reply({ content: `${client.i18n.get(language, "interaction", "error")}`, ephmeral: true });
      }}
    }
}