const yaml = require('js-yaml');
const fs = require('fs');
const prase = require("./prase")

const file = fs.readFileSync('./application.yml', 'utf8')
const yaml_files = prase(file)
let doc

try {
  const res = yaml.load(yaml_files, 'utf8');
  doc = res
} catch (e) {
  console.log(e);
}

module.exports = doc


// module.exports = {
//   // Bot config
//     TOKEN: process.env.TOKEN || doc.bot.TOKEN || "YOUR_TOKEN",  // your bot token
//     EMBED_COLOR: doc.bot.EMBED_COLOR || "#c2e9ff", //<= default is "#c2e9ff"
//     OWNER_ID: doc.bot.OWNER_ID || "YOUR_CLIENT_ID", //your owner discord id example: "515490955801919488"
//     LIMIT_TRACK: doc.bot.LIMIT_TRACK || 50,
//     LIMIT_PLAYLIST: doc.bot.LIMIT_PLAYLIST || 50,
//     LANGUAGE: {
//       defaultLocale: doc.bot.LANGUAGE || "en", // "en" = default language
//       directory: resolve("./src/languages"), // <= location of language
//     },
//     MONGO_URI: process.env.MONGO_URI || doc.bot.MONGO_URI || "YOUR_MONGO_URI", // your mongo uri
//     // DASHBOARD: doc.bot.DASHBOARD || false,

//   // Lavalink config
//     SPOTIFY_ID: doc.lavalink.SPOTIFY.id,
//     SPOTIFY_SECRET: doc.lavalink.SPOTIFY.secret,
//     NP_REALTIME: doc.lavalink.NP_REALTIME || "BOOLEAN", // "true" = realtime, "false" = not realtime :3 // WARNING: on set to "true" = laggy and bot will ratelimit if you have a lot of servers
//     LEAVE_TIMEOUT: doc.lavalink.LEAVE_TIMEOUT || 120000,
//     DEFAULT: doc.lavalink.DEFAULT || ["yorushika", "yoasobi", "tuyu", "hinkik"],
//     NODES: [{
//       url: process.env.NODE_URL || doc.lavalink.NODES.url ||'lavalink-coders.ml:80',
//       name: process.env.NODE_URL || doc.lavalink.NODES.url || 'lavalink-coders.ml:80',
//       auth: process.env.NODE_AUTH || doc.lavalink.NODES.auth || 'coders',
//       secure: process.env.NODE_SECURE ? 
//       parseBoolean(process.env.NODE_SECURE || 'false') : 
//       doc.lavalink.NODES.secure || false
//     }],
//     ENABLE_SPOTIFY: doc.lavalink.SPOTIFY.enable || false,
    // REGEX: [
    //   /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/,
    //   /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
    //   /^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|user\/(.*)\/playlist\/|playlist\/))(.*)$/,
    //   /^https?:\/\/(?:www\.)?deezer\.com\/[a-z]+\/(track|album|playlist)\/(\d+)$/,
    //   /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(soundcloud\.com|snd\.sc)\/(.*)$/,
    //   /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/,
    //   /^https?:\/\/(?:www\.|secure\.|sp\.)?nicovideo\.jp\/watch\/([a-z]{2}[0-9]+)/
    // ],
//     SHOUKAKU_OPTIONS: doc.lavalink.SHOUKAKU_OPTIONS || {
//       moveOnDisconnect: true,
//       resumable: true,
//       resumableTimeout: 600,
//       reconnectTries: Infinity,
//       restTimeout: 3000
//     },

//     get: doc
// }

// function parseBoolean(value){
//   if (typeof(value) === 'string'){
//       value = value.trim().toLowerCase();
//   }
//   switch(value){
//       case true:
//       case "true":
//           return true;
//       default:
//           return false;
//   }
// }