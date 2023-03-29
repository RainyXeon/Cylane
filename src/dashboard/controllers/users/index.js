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
exports.getUserIdPlaylistController = exports.getUserMePlaylistController = exports.getUserController = void 0;
const users_1 = require("../../services/users");
function getUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        try {
            const { data: userFetch } = yield (0, users_1.getUserService)(user.id);
            res.send(userFetch);
        }
        catch (err) {
            console.log(err);
            res.status(400).send('Error');
        }
    });
}
exports.getUserController = getUserController;
function getUserMePlaylistController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        try {
            const playlist = yield (0, users_1.getUserMePlaylistService)(user.id);
            res.send(playlist);
        }
        catch (err) {
            console.log(err);
            res.status(400).send('Error');
        }
    });
}
exports.getUserMePlaylistController = getUserMePlaylistController;
function getUserIdPlaylistController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const playlist = yield (0, users_1.getUserIdPlaylistService)(id);
            res.send(playlist);
        }
        catch (err) {
            console.log(err);
            res.status(400).send('Error');
        }
    });
}
exports.getUserIdPlaylistController = getUserIdPlaylistController;
