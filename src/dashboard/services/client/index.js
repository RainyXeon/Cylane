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
exports.getClientLangService = void 0;
const schemas_1 = require("../../database/schemas");
function getClientLangService() {
    return __awaiter(this, void 0, void 0, function* () {
        const GSetup = yield schemas_1.Avalible.find();
        if (!GSetup) {
            return undefined;
        }
        else if (GSetup) {
            return GSetup[0];
        }
    });
}
exports.getClientLangService = getClientLangService;
