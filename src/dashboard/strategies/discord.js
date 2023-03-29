"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const passport_discord_1 = require("passport-discord");
const passport_1 = __importDefault(require("passport"));
const schemas_1 = require("../database/schemas");
const js_yaml_1 = require("js-yaml");
const fs = __importStar(require("fs"));
const phrases = (0, js_yaml_1.load)(fs.readFileSync('./application.yml', 'utf8'));
passport_1.default.serializeUser((user, done) => {
    return done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield schemas_1.User.findById(id);
        return user ? done(null, user) : done(null, null);
    }
    catch (err) {
        console.log(err);
        return done(err, null);
    }
}));
passport_1.default.use(new passport_discord_1.Strategy({
    clientID: phrases.dash.DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID,
    clientSecret: phrases.dash.DISCORD_CLIENT_SECRET || process.env.DISCORD_CLIENT_SECRET,
    callbackURL: phrases.dash.DISCORD_REDIRECT_URL || process.env.DISCORD_REDIRECT_URL,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(accessToken, refreshToken);
    const { id: discordId } = profile;
    try {
        const existUser = yield schemas_1.User.findOneAndUpdate({ discordId }, { accessToken, refreshToken }, { new: true });
        console.log(`Existing User ${existUser}`);
        if (existUser)
            return done(null, existUser);
        const newUser = new schemas_1.User({ discordId, accessToken, refreshToken });
        const savedUser = yield newUser.save();
        return done(null, savedUser);
    }
    catch (err) {
        console.log(err);
        return done(err, undefined);
    }
})));
