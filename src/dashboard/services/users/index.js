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
exports.getUserIdPlaylistService = exports.getUserMePlaylistService = exports.getUserService = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../utils/constants");
const schemas_1 = require("../../database/schemas");
const js_yaml_1 = require("js-yaml");
const promises_1 = require("fs/promises");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function getUserService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield schemas_1.User.findById(id);
        if (!user)
            throw new Error('No user found');
        const phrases = (0, js_yaml_1.load)(yield (0, promises_1.readFile)('./application.yml', "utf8"));
        const TOKEN = phrases.dash.TOKEN || process.env.TOKEN;
        return axios_1.default.get(`${constants_1.DISCORD_API_URL}/users/@me`, {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        });
    });
}
exports.getUserService = getUserService;
function getUserMePlaylistService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield schemas_1.User.findById(id);
        if (!user)
            throw new Error('No user found');
        const checkPlaylist = yield schemas_1.Playlist.find({ owner: user.discordId, private: true });
        if (checkPlaylist.length == 0) {
            return { msg: "No playlist found" };
        }
        else {
            return { data: checkPlaylist };
        }
    });
}
exports.getUserMePlaylistService = getUserMePlaylistService;
function getUserIdPlaylistService(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield schemas_1.User.findOne({ id: id });
        if (!user)
            throw new Error('No user found');
        const checkPlaylist = yield schemas_1.Playlist.find({ owner: user.discordId, private: false });
        if (checkPlaylist.length == 0) {
            return { msg: "No playlist found" };
        }
        else {
            return { data: checkPlaylist };
        }
    });
}
exports.getUserIdPlaylistService = getUserIdPlaylistService;
