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
exports.logger = void 0;
const DataLoadService_1 = require("./dataload/DataLoadService");
const Units_1 = require("./units/Units");
const tslog_1 = require("tslog");
exports.logger = new tslog_1.Logger({ minLevel: "trace" });
const loader = new DataLoadService_1.DataLoader();
const csvFile = '../../resources/es1.csv';
let rows;
function load(file) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loader.load(file);
        rows = loader.FileRows;
    });
}
function mapRowsToUnits(rows) {
    const mapper = new Units_1.UnitMapper();
    mapper.map(rows);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.logger.info('PACIFIC WAR ENGAGEMENT SCENARIOS');
        // in future the cvsFile will be given from the scenario object loaded at this point
        yield load(csvFile);
        if (!rows) {
            throw Error(`No rows loaded from file ${csvFile}`);
        }
        // 1. Create all units: one unit per row of CVS
        mapRowsToUnits(rows);
        // 2. Create two player objects plus game status object
        // 3. Create unit container within player objects - one for each parseTreeLayer
        // 4. Add units of each side to the respective player containers
    });
}
main();
