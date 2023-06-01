const cron = require('node-cron')
const Avalible = require("../../schemas/avalible.js");

module.exports = async (client) => {
  const avalible_language = client.i18n.getLocales();
  let res = await Avalible.findOne({ language: avalible_language })
  if (res.length == 0) {
    const newLang = new Avalible({
      language: avalible_language,
    })
    newLang.save().catch(() => {});
  }
}