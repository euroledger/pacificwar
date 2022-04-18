"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DataLoader = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv_parse_1 = require("csv-parse");
const __1 = require("..");
const headers = [
    'Type',
    'Side',
    'ID',
    'Name',
    'AP Cost',
    'AA Strength',
    'Launch Capacity',
    'Hit Capacity',
    'Short Gunnery',
    'Medium Gunnery',
    'Long Gunnery',
    'ASW Strength',
    'Short Torpedo Strength',
    'Medium Torpedo Strength',
    'Bombard Strength',
    'Spotter Plane',
    'Air Group',
    'Range',
    'AN Strength',
    'AG Strength',
    'Aircraft Type',
    'Level',
    'Reverse AA Strength',
    'Steps',
    'Size',
];
class DataLoader {
    constructor() {
        this.load = (file) => __awaiter(this, void 0, void 0, function* () {
            const csvFilePath = path.resolve(__dirname, file);
            const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
            let b;
            var p = new Promise((res, rej) => {
                (0, csv_parse_1.parse)(fileContent, {
                    delimiter: ',',
                    columns: headers,
                }, (error, result) => {
                    if (error) {
                        console.error(error);
                    }
                    b = result;
                    let unitArray = b.map((row) => {
                        return { type: row['Type'], side: row['Side'], id: row['ID'], name: row['Name'], apCost: row['AP Cost'],
                            aaStrength: row['AA Strength'], launchCapacity: row['Launch Capacity'], hitCapacity: row['Hit Capacity'],
                            shortGunnery: row['Short Gunnery'], medGunnery: row['Medium Gunnery'], longGunnery: row['Long Gunnery'],
                            aswStrength: row['ASW Strength'], shortTorpedo: row['Short Torpedo Strength'], medTorpedo: row['Medium Torpedo Strength'], bombardStrength: row['Bombard Strength'], spotterPlane: row['Spotter Plane'],
                            airGroup: row['Air Group'], range: row['Range'], anStrength: row['AN Strength'], agStrength: row['AG Strength'],
                            aircraftType: row['Aircraft Type'], aircraftLevel: row['Level'], reverseAA: row['Reverse AA Strength'],
                            steps: row['Steps'], size: row['Size'] };
                    });
                    res(unitArray);
                });
            });
            let x = yield p;
            __1.logger.info(`DataLoader: ${x.length} rows loaded`);
            // remove headers
            x = x.slice(1);
            this.fileRows = x;
            this.setFileRows(x);
        });
    }
    setFileRows(fileRows) {
        if (fileRows) {
            this.fileRows = fileRows;
        }
    }
    get FileRows() {
        return this.fileRows;
    }
}
exports.DataLoader = DataLoader;
