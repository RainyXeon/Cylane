const { Client, GatewayIntentBits, Collection } = require("discord.js");
const Discord = require('discord.js');

class MainClient extends Client {
     constructor() {
        super({
          shards: 'auto',
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
            ]
        });
    this.config = require("./plugins/config.js");
    this.owner = this.config.OWNER_ID;
    this.dev = this.config.DEV_ID;
    this.color = this.config.EMBED_COLOR;
    if(!this.token) this.token = this.config.TOKEN;

    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));

	  const client = this;

    ["slash"].forEach(x => client[x] = new Collection());
    ["loadCommand", "loadEvent", "loadDatabase" ].forEach(x => require(`./handlers/${x}`)(client));

	}
		connect() {
        return super.login(this.token);
    };
};

module.exports = MainClient;