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
const createApp_1 = require("./utils/createApp");
const js_yaml_1 = require("js-yaml");
const promises_1 = require("fs/promises");
require("./database");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Started the api.`);
        const phrases = (0, js_yaml_1.load)(yield (0, promises_1.readFile)('./application.yml', "utf8"));
        const port = phrases.dash.PORT || 1573;
        try {
            const app = (0, createApp_1.createApp)();
            app.listen(port || 1573, () => console.log(`Running on Port ${port}`));
        }
        catch (err) {
            console.log(err);
        }
    });
}
main();
