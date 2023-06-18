const cron = require('node-cron')

module.exports = async (client) => {
  if (client.config.get.features.AUTOFIX_LAVALINK && !client.has_run) {
    require("../plugins/checkLavalinkServer")(client)
    cron.schedule('* 30 * * * *', async () => {
        require("../plugins/checkLavalinkServer")(client)
    })
    client.has_run = true
  }
}