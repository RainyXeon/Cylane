const { 
  getGuildService,
  getMutualGuildsService,
  getGuildControlService,
  getGuildLangService,
  getGuildReqChannelService,
  getUserGuildsService,
  getBotInGuildsService,
  postGuildLangService,
  postGuildControlService
} = require('../services/guilds')


async function getGuildsController(req, res) {
  const user = req.user
  try {
    const guilds = await getMutualGuildsService(user.id)
    res.send(guilds)
  } catch (err){
    console.log(err)
    res.status(400).send('Error')
  }
}

async function getBotInGuildsController(req, res) {
  const user = req.user
  try {
    const guilds = await getBotInGuildsService(user.id)
    res.send(guilds)
  } catch (err){
    console.log(err)
    res.status(400).send('Error')
  }
}

async function getGuildPermissionsController(req, res) 
{
  const user = req.user;
  const { id } = req.params;
  try {
    const guilds = await getMutualGuildsService(user.id);
    const valid = guilds.some((guild) => guild.id === id)
    return valid ? res.sendStatus(200) : res.sendStatus(403)
  } catch (err) {
    console.log(err)
    res.status(400).send({ msg: 'Error' })
  }
}

async function getGuildController(req, res) {
  const { id } = req.params
  try {
    const { data: guild } = await getGuildService(id)
    res.send(guild)
  } catch (err) {
    console.log(err)
    res.status(400).send({ msg: 'Error' })
  }
}

async function getGuildConfigController(req, res) {
  const { id } = req.params;
  try {
    const config = await getGuildControlService(id)
    res.send(config)
  } catch (err) {
    console.log(err)
    res.status(400).send({ msg: 'Error' })
  }
}

async function getGuildLangController(req, res) {
  const { id } = req.params;
  try {
    const config = await getGuildLangService(id)
    res.send(config)
  } catch (err) {
    console.log(err)
    res.status(400).send({ msg: 'Error' })
  }
}

async function getGuildReqChannelController(req, res) {
  const { id } = req.params;
  try {
    const config = await getGuildReqChannelService(id)
    res.send(config)
  } catch (err) {
    console.log(err)
    res.status(400).send({ msg: 'Error' })
  }
}

async function postGuildLangController(req, res) {
  try {
    const { id } = req.params;
    const config = await postGuildLangService(req.body, id)
    if (config) res.sendStatus(200)
    else res.status(400).send({ msg: 'Error' })
  } catch (err) {
    console.log(err)
    res.status(400).send({ msg: 'Error' })
  }
}

async function postGuildControlController(req, res) {
  try {
    const { id } = req.params;
    const config = await postGuildControlService(req.body, id)
    if (config) res.sendStatus(200)
    else res.status(400).send({ msg: 'Error' })
  } catch (err) {
    console.log(err)
    res.status(400).send({ msg: 'Error' })
  }
}

module.exports = {
  getGuildsController,
  getGuildController,
  getGuildPermissionsController,
  getGuildConfigController,
  getGuildLangController,
  getGuildReqChannelController,
  postGuildLangController,
  postGuildControlController,
  getBotInGuildsController,
}