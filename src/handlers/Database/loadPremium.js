const cron = require('node-cron')

module.exports = async (client) => {
  cron.schedule('*/60 * * * * *', async () => {
    const users = await client.db.get("premium")

    if (users && Object.keys(users).length) {

      Object.keys(users).forEach(async function(key, index) {
        const element = json_test[key]

        if (Date.now() >= element.expiresAt) {
          await client.db.set(`premium.user_${key}`, {
            isPremium: false,
            redeemedBy: [],
            redeemedAt: null,
            expiresAt: null,
            plan: null
          })
        }

      });

    }
  })
}