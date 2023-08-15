const cron = require("node-cron");

module.exports = async (client) => {
  const avalible_language = client.i18n.getLocales();
  let res = await client.db.get("bot_language");
  if (!res || res.length == 0) {
    return client.db.set("bot_language", {
      language: avalible_language,
    });
  }
};
