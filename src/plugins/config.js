require("dotenv").config();
const { resolve } = require("path");

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN",  // your bot token
    EMBED_COLOR: checkColor(process.env.EMBED_COLOR), //<= default is "#c2e9ff"

    OWNER_ID: process.env.OWNER_ID || "YOUR_CLIENT_ID", //your owner discord id example: "515490955801919488"

    NP_REALTIME: process.env.NP_REALTIME || "BOOLEAN", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
    LEAVE_TIMEOUT: parseInt(process.env.LEAVE_TIMEOUT || "120000"), // leave timeout default "120000" = 2 minutes // 1000 = 1 seconds

    LANGUAGE: {
      defaultLocale: process.env.LANGUAGE || "en", // "en" = default language
      directory: resolve("./src/languages"), // <= location of language
    },

    DEV_ID: [], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]

    MONGO_URI: process.env.MONGO_URI || "YOUR_MONGO_URI", // your mongo uri

    SPOTIFY_ID: process.env.SPOTIFY_ID,
    SPOTIFY_SECRET: process.env.SPOTIFY_SECRET,

    DEFAULT: ["yorushika", "yoasobi", "tuyu"],

    PREMIUM_COMMANDS: ["profile"],

    NODES: [
      {
        url: process.env.NODE_URL || 'lavalink-coders.ml:80',
        name: process.env.NODE_NAME || 'Main',
        auth: process.env.NODE_AUTH || 'coders',
        secure: parseBoolean(process.env.NODE_SECURE || 'false'),
        retryAmount: Infinity,
        retryDelay: 3000,
      },
    ],

    AUTO_DEPLOY: parseBoolean(process.env.AUTO_DEPLOY || 'true'),

    REGEX: [
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/,
      /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
      /^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|user\/(.*)\/playlist\/|playlist\/))(.*)$/,
      /^https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(track|album|playlist)\/(\d+)$/,
      /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/,
      /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/
    ],
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

function checkColor(color) {
  if (!color) return "#c2e9ff"
  else return "#" + color
}