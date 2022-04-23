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
exports.Main = exports.logger = void 0;
const DataLoadService_1 = require("./dataload/DataLoadService");
const UnitMapper_1 = require("./units/UnitMapper");
const tslog_1 = require("tslog");
const es1_1 = require("./scenarios/es1PearlHarbor/es1");
const PlayerContainer_1 = require("./scenarios/PlayerContainer");
const Utility_1 = require("./utils/Utility");
const GameStatus_1 = require("./scenarios/GameStatus");
const Interfaces_1 = require("./units/Interfaces");
exports.logger = new tslog_1.Logger({
    minLevel: 'info',
    displayDateTime: false,
    displayFunctionName: false,
    displayFilePath: 'hidden',
});
class Main {
    constructor(scenario) {
        this.scenario = scenario;
    }
    get Scenario() {
        return this.scenario;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.file = `../../resources/${this.scenario.CSVFile}`;
            const loader = new DataLoadService_1.DataLoader();
            yield loader.load(this.file);
            this.rows = loader.FileRows;
        });
    }
    mapRowsToUnits(rows) {
        Main.mapper = new UnitMapper_1.UnitMapper();
        Main.mapper.map(rows);
    }
    setUpGame() {
        return __awaiter(this, void 0, void 0, function* () {
            // 2. create player containers
            this.alliedPlayer = new PlayerContainer_1.PlayerContainer(Interfaces_1.Side.Allied, Main.mapper.getUnitsBySide(Interfaces_1.Side.Allied));
            this.japanesePlayer = new PlayerContainer_1.PlayerContainer(Interfaces_1.Side.Japan, Main.mapper.getUnitsBySide(Interfaces_1.Side.Japan));
            // 3. game initialization (eg set up task forces)
            // 4. Choose scenario if this is one player
            if (GameStatus_1.GameStatus.gameType === GameStatus_1.GameType.ONE_PLAYER) {
                GameStatus_1.GameStatus.print('Choose one of the scenarios:');
                GameStatus_1.GameStatus.print('   1. Pearl Harbor');
                GameStatus_1.GameStatus.print('   2. Savo Isand');
                const scenario = yield (0, Utility_1.promptUser)({
                    type: 'number',
                    value: 'value',
                    message: 'Please enter 1 or 2?',
                });
                GameStatus_1.GameStatus.print(`We are going to play scenario ${scenario}`);
                // todo map choice to this.scenaro
            }
            yield this.scenario.setUpScenario(this.japanesePlayer, this.alliedPlayer);
        });
    }
    get Rows() {
        return this.rows;
    }
    static get Mapper() {
        return Main.mapper;
    }
    get AlliedPlayerContainer() {
        return this.alliedPlayer;
    }
    get JapanesePlayerContainer() {
        return this.japanesePlayer;
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            console.clear();
            GameStatus_1.GameStatus.print('PACIFIC WAR ENGAGEMENT SCENARIOS');
            GameStatus_1.GameStatus.print(`Loading data for ${this.scenario.Name}`);
            // in future the cvsFile will be given from the scenario object loaded at this point
            // 1. Create all units: one unit per row of CVS
            yield this.load();
            if (!this.rows) {
                throw Error(`No rows loaded from file ${this.file}`);
            }
            this.mapRowsToUnits(this.rows);
            yield this.setUpGame();
            // for (let i= 0; i < GameStatus.numberOfRuns; i++) {
            //   if (i % 10 === 0) {
            //     console.log("run ", i)
            //   }
            yield this.scenario.doSequenceOfPlay();
            // }
        });
    }
}
exports.Main = Main;
Main.mapper = new UnitMapper_1.UnitMapper();
// later we dsiplay a menu here and plug in the chosen scenario
const executor = new Main(new es1_1.ES1());
executor.main();
