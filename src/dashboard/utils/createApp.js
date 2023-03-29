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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("../routes"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = require("dotenv");
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
require('../strategies/discord');
require('./cron_job');
const js_yaml_1 = require("js-yaml");
const fs = __importStar(require("fs"));
function createApp() {
    const app = (0, express_1.default)();
    const phrases = (0, js_yaml_1.load)(fs.readFileSync('./application.yml', 'utf8'));
    // Enable Parsing Middleware for Requests
    var whitelist = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://www.dreamvast.ml',
        "https://dreamvast.vercel.router",
        'https://dreamvast.ml',
        undefined
    ];
    var corsOptions = {
        origin: function (origin, callback) {
            console.log(`Requested origin: ${origin}, Allowed: ${whitelist.includes(origin)}`);
            if (whitelist.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use((0, express_session_1.default)({
        secret: `${phrases.dash.SIGNATURE || process.env.SIGNATURE}`,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 60 * 24 * 3,
            // secure: true
        },
        store: connect_mongo_1.default.create({
            mongoUrl: phrases.dash.MONGO_URI || process.env.MONGO_URI
        })
    }));
    //Enable Passport
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    const handler = (req, res) => res.sendFile(path_1.default.join(__dirname, '../dash', 'index.html'));
    const routes_name = [
        "/", "/docs/quickstart", "/menu",
        "/dashboard/categories", "/dashboard/language",
        "/dashboard/control", "/docs", "/docs/quickstart",
        "/docs/commands", "/docs/configurations", "/docs/terms",
        "/docs/policy", "/invite", "/login", "/player",
        "/player/select", "/player/panel"
    ];
    app.use(express_1.default.static(path_1.default.join(__dirname, '../dash')));
    routes_name.forEach(route => app.get(route, handler));
    console.log("Running");
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
    app.use('/api', routes_1.default, limiter);
    return app;
}
exports.createApp = createApp;
