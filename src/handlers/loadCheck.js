const cron = require('node-cron')

module.exports = async (client) => {
  if (client.config.get.features.AUTOFIX_LAVALINK && !client.has_run) {
    require("../lava_scrap/checkLavalinkServer")(client)
    cron.schedule('* 30 * * * *', async () => {
        require("../lava_scrap/checkLavalinkServer")(client)
    })
    client.has_run = true
  }
}