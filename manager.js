const { Client, GatewayIntentBits, Collection } = require("discord.js");
const Discord = require('discord.js');
const { Connectors } = require("shoukaku");
const { Kazagumo, KazagumoTrack } = require("kazagumo");

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

    this.manager = new Kazagumo({
        defaultSearchEngine: "youtube", 
        // MAKE SURE YOU HAVE THIS
        send: (guildId, payload) => {
            const guild = client.guilds.cache.get(guildId);
            if (guild) guild.shard.send(payload);
        }
    }, new Connectors.DiscordJS(this), this.config.NODES);

	  const client = this;

    ["slash"].forEach(x => client[x] = new Collection());
    ["loadCommand", "loadEvent", "loadDatabase", "loadNodeEvents", "loadPlayer"].forEach(x => require(`./handlers/${x}`)(client));

	}
		connect() {
        return super.login(this.token);
    };
};

module.exports = MainClient;