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
exports.GameStatus = exports.GameType = void 0;
const BattleCycle_1 = require("../gamesequence/BattleCycle");
var GameType;
(function (GameType) {
    GameType[GameType["COMPUTER_ONLY"] = 0] = "COMPUTER_ONLY";
    GameType[GameType["ONE_PLAYER"] = 1] = "ONE_PLAYER";
})(GameType = exports.GameType || (exports.GameType = {}));
class GameStatus {
    get CurrentPhase() {
        return GameStatus.currentPhase;
    }
    static print(message, ...optionalParams) {
        // console.log(message, ...optionalParams)
    }
    static pause(delay) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 0));
        });
    }
}
exports.GameStatus = GameStatus;
GameStatus.currentPhase = BattleCycle_1.BattleCyclePhase.Lighting;
GameStatus.gameType = GameType.COMPUTER_ONLY;
GameStatus.battleCycle = 1;
GameStatus.numberOfRuns = 1;
