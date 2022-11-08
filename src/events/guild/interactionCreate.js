const { PermissionsBitField, InteractionType, CommandInteraction } = require("discord.js");
const GLang = require("../../plugins/schemas/language.js");
const { DEFAULT } = require("../../plugins/config.js")
const { REGEX } = require("../../plugins/regex.js")

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

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
          const url = interaction.options.get("search").value

          const match = REGEX.some(function (match) {
            return match.test(url) == true;
          });
  
				  const Random = DEFAULT[Math.floor(Math.random() * DEFAULT.length)];

          if (
            interaction.commandName == "play" ||
            interaction.commandName + command.name[1] == "playlist" + "add"
          ) {
            let choice = []
            if (match == true) {
              choice.push({ name: url, value: url })
              await interaction.respond(choice).catch(() => { });
            } else if (match == false) {
              await client.manager.search(url || Random).then(result => {
                for (let i = 0; i <= 10; i++) {
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
        }
    
        if (!command) return;
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`${client.i18n.get(language, "interaction", "dev_only")}`); 
            logger.info(`[INFOMATION] ${interaction.user.tag} trying request the command from ${interaction.guild.name} (${interaction.guild.id})`); 
            return;
        }

        const msg_cmd = [
          `[COMMAND] ${command.name[0]}`,
          `${command.name[1] || ""}`,
          `${command.name[2] || ""}`,
          `used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`,
        ]

        client.logger.info(`${msg_cmd.join(" ")}`);

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