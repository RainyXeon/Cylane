const cron = require('node-cron')

module.exports = async (client) => {
  if (client.config.get.features.AUTOFIX_LAVALINK && !client.has_run) {
    require("../lava_scrap/check_lavalink_server")(client)
    cron.schedule('* 30 * * * *', async () => {
        require("../lava_scrap/check_lavalink_server")(client)
    })
    client.has_run = true
  }
}