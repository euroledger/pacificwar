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
exports.PacificWarScenario = void 0;
const GameStatus_1 = require("./GameStatus");
class PacificWarScenario {
    constructor(options) {
        this.name = options.name;
        this.number = options.number;
        this.csvFile = options.csvFile;
        this.numberBattleCycles = options.numberBattleCycles;
    }
    doSequenceOfPlay() {
        return __awaiter(this, void 0, void 0, function* () {
            yield GameStatus_1.GameStatus.pause(2500);
            GameStatus_1.GameStatus.print('-------------------------------------------------------------------------------------------------');
            GameStatus_1.GameStatus.print("\t\t\t\tBATTLE CYCLE 1");
            GameStatus_1.GameStatus.print("\t\t\t=========================");
            yield this.battleCycle.doSequenceOfPlay();
        });
    }
    get Name() {
        return this.name;
    }
    get Number() {
        return this.number;
    }
    get CSVFile() {
        return this.csvFile;
    }
    get NumberBattleCycles() {
        return this.numberBattleCycles;
    }
}
exports.PacificWarScenario = PacificWarScenario;
