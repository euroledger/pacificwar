"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitMapper = void 0;
const NavalUnit_1 = require("./NavalUnit");
const entityMap = new Map([
    ['NAVAL', mapNavalUnit],
    ['AIR', mapAirUnit],
    ['BASE', mapBaseUnit],
    ['SUBMARINE', mapSubmarineUnit]
]);
class UnitMapper {
    constructor() {
        this.map = (rows) => {
            for (const row of rows) {
                const fn = entityMap.get(row.type);
                if (!fn) {
                    const errorStr = `No Unit Map Function for Type: ${row.id} - ${row.name} - ${row.side}`;
                    throw Error(errorStr);
                }
                fn(row);
            }
        };
    }
}
exports.UnitMapper = UnitMapper;
function mapNavalUnit(row) {
    const navalUnit = new NavalUnit_1.NavalUnit(Object.assign(Object.assign({}, row), { hits: 0 }));
    navalUnit.print();
}
function mapAirUnit() {
}
function mapBaseUnit() {
}
function mapSubmarineUnit() {
}
