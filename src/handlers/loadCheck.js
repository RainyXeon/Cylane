module.exports = async (client) => {
  if (client.config.get.features.AUTOFIX_LAVALINK) {
    require("../lava_scrap/check_lavalink_server")(client)
    setInterval(async () => {
      require("../lava_scrap/check_lavalink_server")(client)
    }, 1800000);
  }
}