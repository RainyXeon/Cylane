module.exports = async function handler(client) {
  ["client.js", "lavalink.js"].forEach((data) => {
    require(`./setup/${data}`)(client);
  });
};
