const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;

    let LANGUAGE = client.i18n;
    let guildModel = await client.db.get(`language.guild_${message.guild.id}`)

    if(guildModel) LANGUAGE = guildModel;
    else if(!guildModel) {
      await client.db.set(`language.guild_${message.guild.id}`, client.config.get.bot.LANGUAGE)
      const newModel = await client.db.get(`language.guild_${message.guild.id}`)
      LANGUAGE = newModel
    }

    const language = LANGUAGE;


    let PREFIX = client.prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    
    const GuildPrefix = await client.db.get(`prefix.guild_${message.guild.id}`)
    if(GuildPrefix) PREFIX = GuildPrefix;
    else if(!GuildPrefix) {
      await client.db.set(`prefix.guild_${message.guild.id}`, client.prefix)
      const newPrefix = await client.db.get(`prefix.guild_${message.guild.id}`)
      PREFIX = newPrefix
    }

    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.i18n.get(language, "help", "wel", { bot: message.guild.members.me.displayName })}`, iconURL: message.guild.iconURL({ dynamic: true })})
        .setColor(client.color)
        .setDescription(stripIndents`
        ${client.i18n.get(language, "help", "intro1", { bot: message.guild.members.me.displayName })}
        ${client.i18n.get(language, "help", "intro2")}
        ${client.i18n.get(language, "help", "intro3")}
        ${client.i18n.get(language, "help", "prefix", { prefix: `\`${PREFIX}\`` })}
        ${client.i18n.get(language, "help", "intro4")}
        ${client.i18n.get(language, "help", "ver", { botver: require("../../../package.json").version })}
        ${client.i18n.get(language, "help", "djs", { djsver: require("../../../package.json").dependencies["discord.js"] })}
        ${client.i18n.get(language, "help", "lavalink", { aver: "v3.0-beta" })}
        ${client.i18n.get(language, "help", "help1", { help: `\`${PREFIX}help\` / \`/help\`` })}
        ${client.i18n.get(language, "help", "help2", { botinfo: `\`${PREFIX}status\` / \`/status\`` })}
        `);
       return message.channel.send({ embeds: [embed] })
    };
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [ matchedPrefix ] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if(!command) return;

    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return await message.author.dmChannel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
    if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) return await message.channel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);

    if(command.owner && message.author.id != client.owner) return message.channel.send(`${client.i18n.get(language, "interaction", "owner_only")}`);

    try {
      if (command.premium) {
        const user = client.premiums.get(message.author.id)
        if (!user || !user.isPremium) {
          const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premium_author")}`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${client.i18n.get(language, "nopremium", "premium_desc")}`)
            .setColor(client.color)
            .setTimestamp()
    
          return message.channel.send({ content: " ", embeds: [embed] });
        }
      }
    } catch (err) {
        console.log(err)
        return message.channel.send({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
    }

    if (command.lavalink) {
      if (client.lavalink_using.length == 0) return message.reply(`${client.i18n.get(language, "music", "no_node")}`)
    }
    
    if (command) {
      try {
          command.run(client, message, args, language, PREFIX)
          // const remove = new EmbedBuilder()
          // .setTitle("Dear all of my users!")
          // .setDescription(`First, thank you for using our bot as well as using our service. 
          // We're really grateful for that. 
          // --------------------/--------------------
          // So, on \`July 1st 2022 at 14:00 (+7 Timezone)\`, we will be ending support for commands written with prefixes (Ex: d!play).
          // __**This is not our decision; Discord has mandated this action.**__
          // If you didn't ready to see slash commands when typing \`/\`. 
          // On July 15, we will create a bot that uses prefixed commands. 
          // **Of course, we will reduce this bot performance to protect the main bot and it will now only available for 60 server (because we are not qualified to verify the bot).**
          // And to make up for this inconvenience, when you use slash \`/\` **you will get free autoplay support without asking for anything with 34 available radios and 24/7 mode (Will be supported)**.
          // --------------------/--------------------
          // To use slash command, please kick the bot and [click here](https://discord.com/api/oauth2/authorize?client_id=958642964018642944&permissions=534861178944&scope=bot%20applications.commands) to reinvite and use slash commands.
          // We hope everyone will understand us!
          // [If you have any questions, click here to go to the support server.](https://discord.gg/xHvsCMjnhU)`)
          // .setColor("#FFD700")
          // message.channel.send({ embeds: [remove] })
      } catch (error) {
        client.logger.log(error)
        message.channel.send({ content: `${client.i18n.get(language, "interaction", "error")}\n ${error}` })
      }
    }
  }