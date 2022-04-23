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
const main_1 = require("../src/main");
const es1_1 = require("../src/scenarios/es1PearlHarbor/es1");
const PlayerContainer_1 = require("../src/scenarios/PlayerContainer");
const Interfaces_1 = require("../src/units/Interfaces");
const executor = new main_1.Main(new es1_1.ES1());
describe('Player Containers', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield executor.load();
        if (!executor.Rows) {
            throw Error('No rows loaded');
        }
        executor.mapRowsToUnits(executor.Rows);
    }));
    test('Player Units', () => __awaiter(void 0, void 0, void 0, function* () {
        const alliedPlayer = new PlayerContainer_1.PlayerContainer(Interfaces_1.Side.Allied, main_1.Main.Mapper.getUnitsBySide(Interfaces_1.Side.Allied));
        expect(alliedPlayer.Units.length).toBe(27);
        const japanesePlayer = new PlayerContainer_1.PlayerContainer(Interfaces_1.Side.Japan, main_1.Main.Mapper.getUnitsBySide(Interfaces_1.Side.Japan));
        expect(japanesePlayer.Units.length).toBe(16);
    }));
});
