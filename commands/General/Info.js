const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const ms = require('pretty-ms');
const GConfig = require("../../plugins/guildConfig.js")

module.exports = {
    name: "info",
    description: "Shows the information of the Bot",
    options: [
        {
            name: "status",
            description: "Shows the status information of the Bot",
            type: 1
        },
        {
            name: "developer",
            description: "Shows the developer information of the Bot (Credit)",
            type: 1
        },
        {
            name: "db-test",
            description: "Enable or disable the player control",
            type: 1,
            options: [
                {
                    name: "input",
                    description: "Choose enable or disable",
                    required: true,
                    type: 3
                }
            ]
        }
    ],
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        switch (interaction.options.getSubcommand()){
            case "status":
                const info = new EmbedBuilder()
                    .setTitle(client.user.tag + " Status")
                    .addFields([
                        { name: 'Uptime', value: `\`\`\`${ms(client.uptime)}\`\`\``, inline: true },
                        { name: 'WebSocket Ping', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
                        { name: 'Memory', value: `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, inline: true },
                        { name: 'Guild Count', value: `\`\`\`${client.guilds.cache.size} guilds\`\`\``, inline: true },
                        { name: 'User Count', value: `\`\`\`${client.users.cache.size} users\`\`\``, inline: true },
                        { name: 'Node', value: `\`\`\`${process.version} on ${process.platform} ${process.arch}\`\`\``, inline: true },
                        { name: 'Cached Data', value: `\`\`\`${client.users.cache.size} users\n${client.emojis.cache.size} emojis\`\`\``, inline: true },
                        { name: 'Discord.js', value: `\`\`\`${version}\`\`\``, inline: true },
                    ])
                    .setTimestamp()
                    .setFooter({ text: "Hope you like me!" })
                    .setColor(client.color);

                const row = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Invite Me")
                        .setStyle("Link")
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
      
                await interaction.editReply({ embeds: [info], components: [row] });
            break;

            case "developer":
                const xeondex = new EmbedBuilder()
                    .setTitle("Adivise/XeonDex | I'm just remake from Adivise")
                    .setDescription("This is a remade music bot with added features. Special thanks to Adivise.")
                    .setFooter({ text: "Consider Joining the server or Inviting the Bot :) This would help me alot!" })
                    .setColor(client.color);

                const row1 = new ActionRowBuilder()
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Github (Adivise)")
                        .setStyle("Link")
                        .setURL("https://github.com/Adivise")
                    )
                    .addComponents(
                      new ButtonBuilder()
                        .setLabel("Github (XeonDex)")
                        .setStyle("Link")
                        .setURL("https://github.com/XeonE52680v3")
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Support Server")
                            .setStyle("Link")
                            .setURL("https://discord.com/invite/xHvsCMjnhU")
                    )

                  
                    await interaction.editReply({ embeds: [xeondex], components: [row1] });
            break;

            case "db-test":
                const input = interaction.options.getString("input");

                const guildControl = await GConfig.findOne({ guild: interaction.guild.id });
                if(!guildControl) {
                    const guildControl = new GConfig({
                        guild: interaction.guild.id,
                        enable: false,
                        channel: "",
                        playmsg: "",
                        language: "en",
                        playerControl: input
                    });
                    guildControl.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`Edited ${input} in mongodb successfully`)
                        .setColor(client.color)

                        interaction.editReply({ embeds: [embed] });
                    }
                    ).catch((err) => {
                        interaction.editReply(`An error occured while saving ${input} into mongodb!`)
                        console.log(err)
                    });
                }
                else if(guildControl) {
                    guildControl.playerControl = input;
                    guildControl.save().then(() => {
                        const embed = new EmbedBuilder()
                        .setDescription(`Edited ${input} in mongodb successfully`)
                        .setColor(client.color)
            
                        interaction.editReply({ embeds: [embed] });
                    }
                    ).catch((err) => {
                        interaction.editReply(`An error occured while editing ${input} into mongodb!`);
                        console.log(err)
                    });
                }
            break;
        }          
    }
};