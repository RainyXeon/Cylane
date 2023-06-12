const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = { 
  name: ["settings", "language"],
  description: "Change the language for the bot",
  category: "Utils",
  options: [
      {
          name: "input",
          description: "The new language",
          required: true,
          type: ApplicationCommandOptionType.String
      }
  ],
run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
            const input = interaction.options.getString("input");

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`${client.i18n.get(language, "utilities", "lang_perm")}`);
            const languages = client.i18n.getLocales();

            if (!languages.includes(input)) return interaction.editReply(`${client.i18n.get(language, "utilities", "provide_lang", {
                languages: languages.join(', ')
            })}`);
    
            const newLang = await client.db.get(`language.guild_${interaction.guild.id}`)
            
            if(!newLang) {
                await client.db.set(`language.guild_${interaction.guild.id}`, input)
                const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "utilities", "lang_set", {
                    language: input
                })}`)
                .setColor(client.color)

                return interaction.editReply({ content: " ", embeds: [embed] });
            }
            else if(newLang) {

                await client.db.set(`language.guild_${interaction.guild.id}`, input)

                const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "utilities", "lang_change", {
                    language: input
                })}`)
                .setColor(client.color)

                return interaction.editReply({ content: " ", embeds: [embed] });
            }
    }
};