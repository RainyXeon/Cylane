const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const formatDuration = require('../../structures/FormatDuration.js');
const { convertTime } = require("../../structures/ConvertTime.js");
const { SlashPage } = require('../../structures/PageQueue.js');

// Main code
module.exports = { 
    name: ["queue"],
    description: "Show the queue of songs.",
    categories: "Music",
    options: [
        {
            name: "page",
            description: "Page number to show.",
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
            const value = interaction.options.getInteger("page");

            const player = client.manager.players.get(interaction.guild.id);
            if (!player) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_player")}`);
            const { channel } = interaction.member.voice;
            if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply(`${client.i18n.get(language, "noplayer", "no_voice")}`);
    
            const song = player.queue.current;
            function fixedduration () {
                const current = player.queue.current.length ?? 0;
                return player.queue
                  .reduce((acc, cur) => acc + (cur.length || 0),
                    current
                );
            }
            const qduration = `${formatDuration(fixedduration())}`;
            const thumbnail = `https://img.youtube.com/vi/${song.identifier}/hqdefault.jpg`;
    
            let pagesNum = Math.ceil(player.queue.length / 10);
            if(pagesNum === 0) pagesNum = 1;
    
            const songStrings = [];
            for (let i = 0; i < player.queue.length; i++) {
                const song = player.queue[i];
                songStrings.push(
                    `**${i + 1}.** [${song.title}](${song.uri}) \`[${formatDuration(song.length)}]\`
                    `);
            }
    
            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = songStrings.slice(i * 10, i * 10 + 10).join('');
    
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${client.i18n.get(language, "music", "queue_author", {
                        guild: interaction.guild.name,
                    })}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(thumbnail)
                    .setColor(client.color)
                    .setDescription(`${client.i18n.get(language, "music", "queue_description", {
                        title: song.title,
                        url: song.uri,
                        request: song.requester,
                        duration: formatDuration(song.length),
                        rest: str == '' ? '  Nothing' : '\n' + str,
                    })}`)
                    .setFooter({ text: `${client.i18n.get(language, "music", "queue_footer", {
                        page: i + 1,
                        pages: pagesNum,
                        queue_lang: player.queue.length,
                        duration: qduration,
                    })}` });
    
                pages.push(embed);
            }
    
            if (!value) {
                if (pages.length == pagesNum && player.queue.length > 10) SlashPage(client, interaction, pages, 60000, player.queue.length, qduration, language);
                else return interaction.editReply({ embeds: [pages[0]] });
            }
            else {
                if (isNaN(value)) return interaction.editReply(`${client.i18n.get(language, "music", "queue_notnumber")}`);
                if (value > pagesNum) return interaction.editReply(`${client.i18n.get(language, "music", "queue_page_notfound", {
                    page: pagesNum,
                })}`);
                const pageNum = value == 0 ? 1 : value - 1;
                return interaction.editReply({ embeds: [pages[pageNum]] });
            }
    }
};