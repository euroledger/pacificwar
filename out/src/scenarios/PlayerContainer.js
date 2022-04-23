"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerContainer = void 0;
class PlayerContainer {
    constructor(side, units) {
        this.side = side;
        this.units = units;
    }
    get Units() {
        return this.units;
    }
}
exports.PlayerContainer = PlayerContainer;
