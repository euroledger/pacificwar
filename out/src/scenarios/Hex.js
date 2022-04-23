"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hex = void 0;
class Hex {
    constructor(hexNumber) {
        this.taskForces = new Array();
        this.hexNumber = 0;
        this.hexNumber = hexNumber;
    }
    get HexNumber() {
        return this.hexNumber;
    }
    addForceToHex(force) {
        this.force = force;
    }
    addTaskForceToHex(taskForce) {
        this.taskForces.push(taskForce);
    }
    get Force() {
        return this.force;
    }
    get TaskForces() {
        return this.taskForces;
    }
}
exports.Hex = Hex;
