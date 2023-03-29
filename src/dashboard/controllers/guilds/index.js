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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGuildControlController = exports.postGuildLangController = exports.getGuildReqChannelController = exports.getGuildLangController = exports.getGuildConfigController = exports.getGuildController = exports.getGuildPermissionsController = exports.getBotInGuildsController = exports.getGuildsController = void 0;
const guilds_1 = require("../../services/guilds");
const guilds_2 = require("../../services/guilds");
function getGuildsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        try {
            const guilds = yield (0, guilds_2.getMutualGuildsService)(user.id);
            res.send(guilds);
        }
        catch (err) {
            console.log(err);
            res.status(400).send('Error');
        }
    });
}
exports.getGuildsController = getGuildsController;
function getBotInGuildsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        try {
            const guilds = yield (0, guilds_2.getBotInGuildsService)(user.id);
            res.send(guilds);
        }
        catch (err) {
            console.log(err);
            res.status(400).send('Error');
        }
    });
}
exports.getBotInGuildsController = getBotInGuildsController;
function getGuildPermissionsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        const { id } = req.params;
        try {
            const guilds = yield (0, guilds_2.getMutualGuildsService)(user.id);
            const valid = guilds.some((guild) => guild.id === id);
            return valid ? res.sendStatus(200) : res.sendStatus(403);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ msg: 'Error' });
        }
    });
}
exports.getGuildPermissionsController = getGuildPermissionsController;
function getGuildController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const { data: guild } = yield (0, guilds_1.getGuildService)(id);
            res.send(guild);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ msg: 'Error' });
        }
    });
}
exports.getGuildController = getGuildController;
function getGuildConfigController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const config = yield (0, guilds_2.getGuildControlService)(id);
            res.send(config);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ msg: 'Error' });
        }
    });
}
exports.getGuildConfigController = getGuildConfigController;
function getGuildLangController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const config = yield (0, guilds_2.getGuildLangService)(id);
            res.send(config);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ msg: 'Error' });
        }
    });
}
exports.getGuildLangController = getGuildLangController;
function getGuildReqChannelController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const config = yield (0, guilds_2.getGuildReqChannelService)(id);
            res.send(config);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ msg: 'Error' });
        }
    });
}
exports.getGuildReqChannelController = getGuildReqChannelController;
function postGuildLangController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const config = yield (0, guilds_2.postGuildLangService)(req.body, id);
            if (config)
                res.sendStatus(200);
            else
                res.status(400).send({ msg: 'Error' });
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ msg: 'Error' });
        }
    });
}
exports.postGuildLangController = postGuildLangController;
function postGuildControlController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const config = yield (0, guilds_2.postGuildControlService)(req.body, id);
            if (config)
                res.sendStatus(200);
            else
                res.status(400).send({ msg: 'Error' });
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ msg: 'Error' });
        }
    });
}
exports.postGuildControlController = postGuildControlController;
