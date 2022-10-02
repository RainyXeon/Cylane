const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('pretty-ms');
const GConfig = require("../../plugins/guildConfig.js")

module.exports = {
    name: "test",
    description: "Test command",
    options: [
        {
            name: "search",
            description: "The song link or name",
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    run: async (interaction, client) => {
    }
};
