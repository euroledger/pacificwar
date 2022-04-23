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
exports.promptUser = exports.random = exports.getDieRoll = void 0;
const prompts_1 = __importDefault(require("prompts"));
function getDieRoll() {
    return Math.floor(Math.random() * 10);
}
exports.getDieRoll = getDieRoll;
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.random = random;
function promptUser(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, prompts_1.default)({
            type: config.type,
            name: config.value,
            message: config.message,
            validate: (value) => (value < 1 || value > 2) ? `Must enter a value between 1 and 2` : true,
        });
        return response.value;
    });
}
exports.promptUser = promptUser;
