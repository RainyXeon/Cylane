const { Client, GatewayIntentBits, Collection } = require("discord.js");
const Discord = require('discord.js');
const { Connectors } = require("shoukaku");
const { Kazagumo, KazagumoTrack } = require("kazagumo");
const logger = require('./plugins/logger')
const { I18n } = require("@hammerhq/localization")
const Spotify = require('kazagumo-spotify');

class CylaneClient extends Client {
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
    this.i18n = new I18n(this.config.LANGUAGE);
    this.logger = logger

    process.on('unhandledRejection', error => this.logger.log({ level: 'error', message: error }));
    process.on('uncaughtException', error => this.logger.log({ level: 'error', message: error }));

    this.manager = new Kazagumo({
        defaultSearchEngine: "youtube", 
        // MAKE SURE YOU HAVE THIS
        send: (guildId, payload) => {
            const guild = client.guilds.cache.get(guildId);
            if (guild) guild.shard.send(payload);
        },
        plugins: [
            new Spotify({
              clientId: this.config.SPOTIFY_ID,
              clientSecret: this.config.SPOTIFY_SECRET,
              playlistPageLimit: 1, // optional ( 100 tracks per page )
              albumPageLimit: 1, // optional ( 50 tracks per page )
              searchLimit: 10, // optional ( track search limit. Max 50 )
              searchMarket: 'US', // optional || default: US ( Enter the country you live in. [ Can only be of 2 letters. For eg: US, IN, EN ] )//
            }),
          ],
    }, new Connectors.DiscordJS(this), this.config.NODES);

    ["slash"].forEach(x => this[x] = new Collection());
    ["loadCommand", "loadEvent", "loadDatabase", "loadNodeEvents", "loadPlayer"].forEach(x => require(`./handlers/${x}`)(this));

    const client = this;

	}
		connect() {
        return super.login(this.token);
    };
};

module.exports = CylaneClient;