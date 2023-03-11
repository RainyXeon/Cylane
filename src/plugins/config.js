require("dotenv").config();
const { resolve } = require("path");
const yaml = require('js-yaml');
const fs   = require('fs');

let doc

try {
  const yaml_files = yaml.load(fs.readFileSync('./application.yml', 'utf8'));
  doc = yaml_files
} catch (e) {
  console.log(e);
}

module.exports = {
  // Bot config
    TOKEN: process.env.TOKEN || doc.bot.TOKEN || "YOUR_TOKEN",  // your bot token
    EMBED_COLOR: doc.bot.EMBED_COLOR || "#c2e9ff", //<= default is "#c2e9ff"
    OWNER_ID: doc.bot.OWNER_ID || "YOUR_CLIENT_ID", //your owner discord id example: "515490955801919488"
    NP_REALTIME: doc.bot.NP_REALTIME || "BOOLEAN", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
    LEAVE_TIMEOUT: doc.bot.LEAVE_TIMEOUT || 120000, // leave timeout default "120000" = 2 minutes // 1000 = 1 seconds
    LANGUAGE: {
      defaultLocale: doc.bot.LANGUAGE || "en", // "en" = default language
      directory: resolve("./src/languages"), // <= location of language
    },
    DEV_ID: doc.bot.DEV_ID || [], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]
    MONGO_URI: process.env.MONGO_URI || doc.bot.MONGO_URI || "YOUR_MONGO_URI", // your mongo uri
    ENABLE_MESSAGE: doc.bot.ENABLE_MESSAGE || false,
    AUTO_DEPLOY: doc.bot.AUTO_DEPLOY || true,
    PREFIX: doc.bot.PREFIX || "d!",

  // Lavalink config
    SPOTIFY_ID: doc.lavalink.SPOTIFY_ID,
    SPOTIFY_SECRET: doc.lavalink.SPOTIFY_SECRET,
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
    ENABLE_SPOTIFY: doc.lavalink.ENABLE_SPOTIFY || false,
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

  // Websocket config
    PORT: doc.websocket.PORT || 8080,
    WEBSOCKET:doc.websocket.WEBSOCKET || false,
    AUTHENICATOR: doc.websocket.AUTHENICATOR || false,
    TRUSTED_ORIGIN: doc.websocket.TRUSTED_ORIGIN || ['http://localhost:3000']
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