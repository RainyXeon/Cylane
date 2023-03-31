const axios = require('axios')
const config = require('../plugins/config')

const User =  require('../schemas/User')
const Control = require('../schemas/Control')
const Language = require('../schemas/Language')
const Setup = require('../schemas/Setup')

async function getBotGuildsService() {
  return axios.get(`${config.DISCORD_API_URL}/users/@me/guilds`, {
    headers: { Authorization: `Bot ${config.TOKEN}` }
  })
}
async function getUserGuildsService(id) {
  const user = await User.findById(id)
  if (!user) throw new Error('No user found')
  return axios.get(`${config.DISCORD_API_URL}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${user.accessToken}` }
  })
}

async function getBotInGuildsService(id) {
  const { data: botGuilds } = await getBotGuildsService()
  const { data: userGuilds } = await getUserGuildsService(id)
  const adminUserGuilds = userGuilds.filter(
    ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
  )
  return userGuilds.filter((guild) => 
    botGuilds.some((botGuilds) => botGuilds.id === guild.id)
  )
}

async function getMutualGuildsService(id) {
  const { data: botGuilds } = await getBotGuildsService()
  const { data: userGuilds } = await getUserGuildsService(id)
  const adminUserGuilds = userGuilds.filter(
    ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
  )
  return adminUserGuilds.filter((guild) => 
    botGuilds.some((botGuilds) => botGuilds.id === guild.id)
  )
}

async function getGuildService(id) {
  return axios.get(`${config.DISCORD_API_URL}/guilds/${id}`, {
    headers: { Authorization: `Bot ${config.TOKEN}` }
  })
}

async function getGuildControlService(id) {
  const GControl = await Control.findOne({ guild: id });
  if (!GControl) {
    const SaveControl = new Control({
      guild: id,
      playerControl: "enable"
    });
    SaveControl.save().catch((err) => console.log(err))
    return SaveControl
  } else if (GControl) {
    return GControl
  }
}

async function getGuildLangService(id) {
  const GLang = await Language.findOne({ guild: id });
  if (!GLang) {
    const SaveLang = new Language({
      guild: id,
      language: "en"
    });
    SaveLang.save().catch((err) => console.log(err))
    return SaveLang
  } else if (GLang) {
    return GLang
  }
}

async function getGuildReqChannelService(id) {
  const GSetup = await Setup.findOne({ guild: id });
  if (!GSetup) {
    const SaveSetup = new Setup({
      guild: id,
      enable: false,
      channel: "",
      playmsg: "",
    });
    SaveSetup.save().catch((err) => console.log(err))
    return SaveSetup
  } else if (GSetup) {
    return GSetup
  }
}

async function postGuildLangService(body, id) {
  let GLang = await Language.findOne({ guild: id });
  console.log(body, id)
  if (!GLang) {
    const SaveLang = new Language({
      guild: id,
      language: body.language,
    });
    SaveLang.save().catch((err) => console.log(err))
    return true
  } else if (GLang) {
    GLang.language = body.language
    GLang.save().catch((err) => console.log(err))
    return true
  } else {
    return false
  }
}

async function postGuildControlService(body, id) {
  let GControl = await Control.findOne({ guild: id });
  console.log(body, id)
  if (!GControl) {
    const SaveControl = new Control({
      guild: id,
      playerControl: body.control
    });
    SaveControl.save().catch((err) => console.log(err))
    return true
  } else if (GControl) {
    GControl.playerControl = body.control
    GControl.save().catch((err) => console.log(err))
    return true
  } else {
    return false
  }
}

module.exports = { 
  getGuildService,
  getMutualGuildsService,
  getGuildControlService,
  getGuildLangService,
  getGuildReqChannelService,
  getUserGuildsService,
  getBotInGuildsService,
  postGuildLangService,
  postGuildControlService
}