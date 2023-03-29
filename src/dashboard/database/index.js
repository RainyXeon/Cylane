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
const mongoose_1 = __importDefault(require("mongoose"));
const js_yaml_1 = require("js-yaml");
const promises_1 = require("fs/promises");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function run_db() {
    return __awaiter(this, void 0, void 0, function* () {
        const phrases = (0, js_yaml_1.load)(yield (0, promises_1.readFile)('./application.yml', "utf8"));
        mongoose_1.default
            .connect(`${phrases.dash.MONGO_URI || process.env.MONGO_URI}`)
            .then(() => console.log('Connected to Database'))
            .catch((err) => console.log(err));
    });
}
run_db();
