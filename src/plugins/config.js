require("dotenv").config();
const { resolve } = require("path");
const yaml = require('js-yaml');
const fs   = require('fs');

let doc

try {
  const yaml_files = yaml.load(fs.readFileSync('./application.yml', 'utf8'));
  doc = yaml_files
  parseProcessEngine(doc)
} catch (e) {
  console.log(e);
}

module.exports = {
  // Bot config
    TOKEN: process.env.TOKEN || doc.bot.TOKEN || "YOUR_TOKEN",  // your bot token
    EMBED_COLOR: doc.bot.EMBED_COLOR || "#c2e9ff", //<= default is "#c2e9ff"
    OWNER_ID: doc.bot.OWNER_ID || "YOUR_CLIENT_ID", //your owner discord id example: "515490955801919488"
    LIMIT_TRACK: doc.bot.LIMIT_TRACK || 50,
    LIMIT_PLAYLIST: doc.bot.LIMIT_PLAYLIST || 50,
    LANGUAGE: {
      defaultLocale: doc.bot.LANGUAGE || "en", // "en" = default language
      directory: resolve("./src/languages"), // <= location of language
    },
    MONGO_URI: process.env.MONGO_URI || doc.bot.MONGO_URI || "YOUR_MONGO_URI", // your mongo uri
    // DASHBOARD: doc.bot.DASHBOARD || false,

  // Lavalink config
    SPOTIFY_ID: doc.lavalink.SPOTIFY.id,
    SPOTIFY_SECRET: doc.lavalink.SPOTIFY.secret,
    NP_REALTIME: doc.lavalink.NP_REALTIME || "BOOLEAN", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
    LEAVE_TIMEOUT: doc.lavalink.LEAVE_TIMEOUT || 120000,
    DEFAULT: doc.lavalink.DEFAULT || ["yorushika", "yoasobi", "tuyu", "hinkik"],
    NODES: doc.lavalink.ENV_NODE ?
    [
      {
        url: process.env.NODE_URL || 'lavalink-coders.ml:80',
        name: process.env.NODE_NAME || 'Main (PROCESS.ENV)',
        auth: process.env.NODE_AUTH || 'coders',
        secure: parseBoolean(process.env.NODE_SECURE || 'false'),
      },
    ] : doc.lavalink.NODES || [
      {
        url: 'lavalink-coders.ml:80',
        name: 'Main',
        auth: 'coders',
        secure: false,
      },
    ],
    ENABLE_SPOTIFY: doc.lavalink.SPOTIFY.enable || false,
    REGEX: [
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/,
      /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
      /^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|user\/(.*)\/playlist\/|playlist\/))(.*)$/,
      /^https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(track|album|playlist)\/(\d+)$/,
      /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/,
      /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/,
      /^https?:\/\/(?:www\.|secure\.|sp\.)?nicovideo\.jp\/watch\/([a-z]{2}[0-9]+)/
    ],
    SHOUKAKU_OPTIONS: doc.lavalink.SHOUKAKU_OPTIONS || {
      moveOnDisconnect: true,
      resumable: true,
      resumableTimeout: 600,
      reconnectTries: Infinity,
      restTimeout: 3000
    },

    get: doc,

    features: {

      MESSAGE_CONTENT: {
        enable: doc.features.MESSAGE_CONTENT.enable || false,
        prefix: doc.features.MESSAGE_CONTENT.prefix || "d!"
      },

      AUTO_DEPLOY: doc.features.AUTO_DEPLOY || true,
      DEV_ID: doc.features.DEV_ID || [], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]

      WEBSOCKET: {
        enable: doc.features.WEBSOCKET.enable || false,
        port: doc.features.WEBSOCKET.port || 8080,
        auth: doc.features.WEBSOCKET.auth || false,
        trusted: doc.features.WEBSOCKET.trusted || ['http://localhost:3000'],
      }
    }

}

function parseBoolean(value){
  if (typeof(value) === 'string'){
      value = value.trim().toLowerCase();
  }
  switch(value){
      case true:
      case "true":
          return true;
      default:
          return false;
  }
}

function parseProcessEngine(value) {
  const array_filter_1 = []
  const array_filter_2 = []
  let array_backup
  const split = Object.values(value)

  for (let i = 0; i < split.length; i++) {
    const element = Object.values(split[i]);
    array_filter_1.push(...element)
  }

  for (let i = 0; i < array_filter_1.length; i++) {
    const element = array_filter_1[i];

    if (typeof element === 'object' && element !== null) {
      array_backup = array_filter_1
      const element_filter = Object.values(element);
      array_filter_2.push(...element_filter)
    }
    
    array_filter_2.push(element)
  }

  console.log(array_filter_2)
}