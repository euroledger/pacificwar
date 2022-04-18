"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavalUnit = void 0;
const BaseUnit_1 = require("./BaseUnit");
class NavalUnit extends BaseUnit_1.BaseUnit {
    constructor(options) {
        super(options.name, options.type, options.side, options.id, options.apCost, options.aaStrength, options.hits);
    }
    print() {
        super.print();
        //   GameStatus.print("")
    }
}
exports.NavalUnit = NavalUnit;
