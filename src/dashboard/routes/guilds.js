const { Router } = require('express')
const {
  getGuildsController,
  getGuildController,
  getGuildPermissionsController,
  getGuildConfigController,
  getGuildLangController,
  getGuildReqChannelController,
  postGuildLangController,
  postGuildControlController,
  getBotInGuildsController,
} = require('../controllers/guilds');

const router = Router()

router.get('/', getGuildsController)

router.get('/user', getBotInGuildsController)

router.get('/:id', getGuildController)

router.get('/:id/permissions', getGuildPermissionsController)

router.get('/:id/settings/setup', getGuildReqChannelController)

router.get('/:id/settings/control', getGuildConfigController)

router.post('/:id/settings/control', postGuildControlController)

router.get('/:id/settings/language', getGuildLangController)

router.post(`/:id/settings/language`, postGuildLangController);

module.exports = router;
