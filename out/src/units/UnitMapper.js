"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitMapper = void 0;
const AirUnit_1 = require("./AirUnit");
const BaseUnit_1 = require("./BaseUnit");
const NavalUnit_1 = require("./NavalUnit");
class UnitMapper {
    constructor() {
        this.units = new Array();
        this.map = (rows) => {
            for (const row of rows) {
                const fn = this.entityMap.get(row.type);
                if (!fn) {
                    const errorStr = `No Unit Map Function for Type: ${row.id} - ${row.name} - ${row.side}`;
                    throw Error(errorStr);
                }
                fn(row);
            }
        };
        this.entityMap = new Map([
            ['NAVAL', this.mapNavalUnit],
            ['AIR', this.mapAirUnit],
            ['BASE', this.mapBaseUnit],
            ['SUBMARINE', this.mapSubmarineUnit],
        ]);
        UnitMapper._this = this;
    }
    mapNavalUnit(row) {
        const navalUnit = new NavalUnit_1.NavalUnit(Object.assign(Object.assign({}, row), { hits: 0 }));
        UnitMapper._this.units.push(navalUnit);
    }
    mapAirUnit(row) {
        const airUnit = new AirUnit_1.AirUnit(Object.assign(Object.assign({}, row), { hits: 0 }));
        UnitMapper._this.units.push(airUnit);
    }
    mapBaseUnit(row) {
        const baseUnit = new BaseUnit_1.BaseUnit(Object.assign({}, row));
        UnitMapper._this.units.push(baseUnit);
    }
    mapSubmarineUnit(row) {
        const subUnit = new NavalUnit_1.SubmarineUnit(Object.assign(Object.assign({}, row), { hits: 0 }));
        UnitMapper._this.units.push(subUnit);
    }
    getUnitById(side, id) {
        const result = this.units
            .filter((unit) => unit.Side == side && unit.Id == id);
        if (result.length == 0) {
            throw new Error(`getUnitById: No results found for side ${side}, id ${id}`);
        }
        if (result.length > 1) {
            throw new Error(`getUnitById: Duplicate results found for side ${side}, id ${id} -> result: ` +
                result);
        }
        return result[0];
    }
    getUnitsBySide(side) {
        return this.units.filter((unit) => unit.Side == side);
    }
    get Units() {
        return this.units;
    }
}
exports.UnitMapper = UnitMapper;
