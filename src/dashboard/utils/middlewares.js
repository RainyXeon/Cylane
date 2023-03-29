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
exports.isAuthenticated = void 0;
const schemas_1 = require("../database/schemas");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user)
        return next();
    else {
        const UToken = yield schemas_1.Token.findOne({ token: req.headers.authorization });
        if (UToken) {
            req.user = {
                id: UToken.schemasId,
                discordId: UToken.discordId,
                accessToken: UToken.accessToken,
                refreshToken: UToken.refreshToken,
            };
            return next();
        }
        return res.status(403).send({ msg: 'Unauthorized' });
    }
});
exports.isAuthenticated = isAuthenticated;
