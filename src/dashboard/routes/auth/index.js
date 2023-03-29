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
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const schemas_1 = require("../../database/schemas");
const voucher_code_generator_1 = __importDefault(require("voucher-code-generator"));
const js_yaml_1 = require("js-yaml");
const promises_1 = require("fs/promises");
const router = (0, express_1.Router)();
router.get('/discord', passport_1.default.authenticate('discord'), (req, res) => {
    res.sendStatus(200);
});
router.get('/discord/redirect', passport_1.default.authenticate('discord'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phrases = (0, js_yaml_1.load)(yield (0, promises_1.readFile)('./application.yml', "utf8"));
    const userReq = req.user;
    const UToken = yield schemas_1.Token.findOne({ discordId: userReq.discordId });
    const expires_data = req.session.cookie.expires;
    const date = new Date(expires_data);
    const milliseconds = date.getTime();
    if (UToken) {
        const get_token = UToken.token;
        const redirect_url = `${phrases.dash.REDIRECT || process.env.REDIRECT}`
            + "/?connect-token=" + get_token
            + "&expires=" + UToken.expires;
        console.log("Existed token" + UToken);
        return res.redirect(redirect_url);
    }
    if (!UToken) {
        const token_code = voucher_code_generator_1.default.generate({
            length: 80,
        });
        console.log(`Generated token: ${token_code}`);
        const SaveToken = new schemas_1.Token({
            discordId: userReq.discordId,
            accessToken: userReq.accessToken,
            refreshToken: userReq.refreshToken,
            schemasId: userReq.id,
            token: token_code[0],
            expires: milliseconds,
        });
        console.log("New Token: " + SaveToken);
        SaveToken.save().catch((err) => console.log(err));
        const redirect_url = `${phrases.dash.REDIRECT || process.env.REDIRECT}`
            + "/?connect-token=" + token_code
            + "&expires=" + milliseconds;
        return res.redirect(redirect_url);
    }
}));
router.get('/status', (req, res) => {
    return req.user
        ? res.status(200).send(req.user)
        : res.status(401).send({ msg: 'Unauthorized' });
});
exports.default = router;
