const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Connectors } = require("shoukaku");
const { Kazagumo, Plugins } = require("kazagumo");
const logger = require('../../plugins/logger')
const { I18n } = require("@hammerhq/localization")
const Spotify = require('kazagumo-spotify');
const Cluster = require('discord-hybrid-sharding');
const Deezer = require('kazagumo-deezer');
const Nico = require('kazagumo-nico');
const { resolve } = require("path");

class Manager extends Client {
    constructor() {
        super({
            shards: Cluster.data.SHARD_LIST,
            shardCount: Cluster.data.TOTAL_SHARDS,
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: require("../../plugins/config.js").features.MESSAGE_CONTENT.enable ? [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ] : [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
            ]
        });

    logger.info("Booting client...")
    this.config = require("../../plugins/config.js");
    
    if (
        this.config.features.WEBSOCKET.enable
        || this.config.features.ALIVE_SERVER.enable){
        logger.error("You cannot enable this feature on advanced shard system!\n To use it, please run the bot in normal mode by type `npm run start:normal` or `npm start`\n To disable, use <feature_name>: false in application.yml files\nBanned features: ALIVE_SERVER, WEBSOCKET")
        process.exit()
    }

    this.owner = this.config.bot.OWNER_ID;
    this.dev = this.config.bot.DEV_ID;
    this.color = this.config.bot.EMBED_COLOR || "#2b2d31";
    if(!this.token) this.token = this.config.bot.TOKEN;
    this.i18n = new I18n({
        defaultLocale: this.config.bot.LANGUAGE || "en",
        directory: resolve("./src/languages"),
    });
    this.logger = logger
    this.prefix = this.config.features.MESSAGE_CONTENT.prefix || "d!"
    this.shard_status = true

    // Auto fix lavalink varibles
    this.lavalink_list = []
    this.lavalink_using = []
    this.fixing_nodes = false
    this.used_lavalink = []

    process.on('unhandledRejection', error => this.logger.log({ level: 'error', message: error }))
    process.on('uncaughtException', error => this.logger.log({ level: 'error', message: error }))

    require(`../../connection/database`)(this)

    if 
    (
        this.config.lavalink.NODES.length > 1
        && this.config.features.AUTOFIX_LAVALINK
    ) 
    return this.logger.error("You cannot use more than 1 lavalink in AUTOFIX features")

    this.manager = new Kazagumo({
        defaultSearchEngine: "youtube", 
        // MAKE SURE YOU HAVE THIS
        send: (guildId, payload) => {
            const guild = this.guilds.cache.get(guildId);
            if (guild) guild.shard.send(payload);
        },
        plugins: this.config.lavalink.ENABLE_SPOTIFY ? [
            new Spotify({
              clientId: this.config.SPOTIFY_ID,
              clientSecret: this.config.SPOTIFY_SECRET,
              playlistPageLimit: 1, // optional ( 100 tracks per page )
              albumPageLimit: 1, // optional ( 50 tracks per page )
              searchLimit: 10, // optional ( track search limit. Max 50 )
              searchMarket: 'US', // optional || default: US ( Enter the country you live in. [ Can only be of 2 letters. For eg: US, IN, EN ] )//
            }),
            new Deezer(),
            new Nico({ searchLimit: 10 }),
            new Plugins.PlayerMoved(this)
          ] : [
            new Deezer(),
            new Nico({ searchLimit: 10 }),
            new Plugins.PlayerMoved(this)
          ],
    }, new Connectors.DiscordJS(this), this.config.lavalink.NODES, this.config.features.AUTOFIX_LAVALINK ? null : this.config.lavalink.SHOUKAKU_OPTIONS);

    const loadCollection = [
        "slash", 
        "commands", 
        "premiums", 
        "interval", 
        "sent_queue", 
        "aliases",
        "pl_editing"
    ]

    if (!this.config.features.MESSAGE_CONTENT.enable) loadCollection.splice(loadCollection.indexOf('commands'), 1);
    
    loadCollection.forEach(x => this[x] = new Collection());

    this.cluster = new Cluster.Client(this);

    const client = this;

	}
		
    connect() {
        return super.login(this.token);
    };
};

module.exports = Manager;
