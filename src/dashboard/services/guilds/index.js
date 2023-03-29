"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGuildControlService = exports.postGuildLangService = exports.getGuildReqChannelService = exports.getGuildLangService = exports.getGuildControlService = exports.getGuildService = exports.getMutualGuildsService = exports.getBotInGuildsService = exports.getUserGuildsService = exports.getBotGuildsService = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../utils/constants");
const schemas_1 = require("../../database/schemas");
const js_yaml_1 = require("js-yaml");
const promises_1 = require("fs/promises");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function getBotGuildsService() {
    return __awaiter(this, void 0, void 0, function* () {
        const phrases = (0, js_yaml_1.load)(yield (0, promises_1.readFile)('./application.yml', "utf8"));
        const TOKEN = phrases.dash.TOKEN || process.env.TOKEN;
        return axios_1.default.get(`${constants_1.DISCORD_API_URL}/users/@me/guilds`, {
            headers: { Authorization: `Bot ${TOKEN}` }
        });
    });
}
exports.getBotGuildsService = getBotGuildsService;
function getUserGuildsService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield schemas_1.User.findById(id);
        if (!user)
            throw new Error('No user found');
        return axios_1.default.get(`${constants_1.DISCORD_API_URL}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        });
    });
}
exports.getUserGuildsService = getUserGuildsService;
function getBotInGuildsService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: botGuilds } = yield getBotGuildsService();
        const { data: userGuilds } = yield getUserGuildsService(id);
        const adminUserGuilds = userGuilds.filter(({ permissions }) => (parseInt(permissions) & 0x8) === 0x8);
        return userGuilds.filter((guild) => botGuilds.some((botGuilds) => botGuilds.id === guild.id));
    });
}
exports.getBotInGuildsService = getBotInGuildsService;
function getMutualGuildsService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: botGuilds } = yield getBotGuildsService();
        const { data: userGuilds } = yield getUserGuildsService(id);
        const adminUserGuilds = userGuilds.filter(({ permissions }) => (parseInt(permissions) & 0x8) === 0x8);
        return adminUserGuilds.filter((guild) => botGuilds.some((botGuilds) => botGuilds.id === guild.id));
    });
}
exports.getMutualGuildsService = getMutualGuildsService;
function getGuildService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const phrases = (0, js_yaml_1.load)(yield (0, promises_1.readFile)('./application.yml', "utf8"));
        const TOKEN = phrases.dash.TOKEN || process.env.TOKEN;
        return axios_1.default.get(`${constants_1.DISCORD_API_URL}/guilds/${id}`, {
            headers: { Authorization: `Bot ${TOKEN}` }
        });
    });
}
exports.getGuildService = getGuildService;
function getGuildControlService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const GControl = yield schemas_1.Control.findOne({ guild: id });
        if (!GControl) {
            const SaveControl = new schemas_1.Control({
                guild: id,
                playerControl: "enable"
            });
            SaveControl.save().catch((err) => console.log(err));
            return SaveControl;
        }
        else if (GControl) {
            return GControl;
        }
    });
}
exports.getGuildControlService = getGuildControlService;
function getGuildLangService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const GLang = yield schemas_1.Language.findOne({ guild: id });
        if (!GLang) {
            const SaveLang = new schemas_1.Language({
                guild: id,
                language: "en"
            });
            SaveLang.save().catch((err) => console.log(err));
            return SaveLang;
        }
        else if (GLang) {
            return GLang;
        }
    });
}
exports.getGuildLangService = getGuildLangService;
function getGuildReqChannelService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const GSetup = yield schemas_1.Setup.findOne({ guild: id });
        if (!GSetup) {
            const SaveSetup = new schemas_1.Setup({
                guild: id,
                enable: false,
                channel: "",
                playmsg: "",
            });
            SaveSetup.save().catch((err) => console.log(err));
            return SaveSetup;
        }
        else if (GSetup) {
            return GSetup;
        }
    });
}
exports.getGuildReqChannelService = getGuildReqChannelService;
function postGuildLangService(body, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let GLang = yield schemas_1.Language.findOne({ guild: id });
        console.log(body, id);
        if (!GLang) {
            const SaveLang = new schemas_1.Language({
                guild: id,
                language: body.language,
            });
            SaveLang.save().catch((err) => console.log(err));
            return true;
        }
        else if (GLang) {
            GLang.language = body.language;
            GLang.save().catch((err) => console.log(err));
            return true;
        }
        else {
            return false;
        }
    });
}
exports.postGuildLangService = postGuildLangService;
function postGuildControlService(body, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let GControl = yield schemas_1.Control.findOne({ guild: id });
        console.log(body, id);
        if (!GControl) {
            const SaveControl = new schemas_1.Control({
                guild: id,
                playerControl: body.control
            });
            SaveControl.save().catch((err) => console.log(err));
            return true;
        }
        else if (GControl) {
            GControl.playerControl = body.control;
            GControl.save().catch((err) => console.log(err));
            return true;
        }
        else {
            return false;
        }
    });
}
exports.postGuildControlService = postGuildControlService;
