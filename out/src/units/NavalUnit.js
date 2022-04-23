"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavalUnit = exports.SubmarineUnit = void 0;
const AbstractUnit_1 = require("./AbstractUnit");
const CapitalShips = [
    'CV',
    'CVL',
    'CVS',
    'BB',
    'BC'
];
class SubmarineUnit extends AbstractUnit_1.AbstractUnit {
    constructor(options) {
        super(options.name, options.type, options.side, options.id, options.apCost, options.aaStrength, options.hits);
        this.steps = options.steps;
    }
    get Steps() {
        return this.steps;
    }
}
exports.SubmarineUnit = SubmarineUnit;
class NavalUnit extends AbstractUnit_1.AbstractUnit {
    constructor(options) {
        super(options.name, options.type, options.side, options.id, options.apCost, options.aaStrength, options.hits);
        this.hitCapacity = 0;
        this.crippled = false;
        this.loaded = false;
        if (options.hitCapacity.startsWith('c')) {
            this.crippled = true;
        }
        this.hitCapacity = parseInt(options.hitCapacity.replace('c', ''));
        this.launchCapacity = options.launchCapacity;
        this.shortGunnery = options.shortGunnery;
        this.mediumGunnery = options.mediumGunnery;
        this.longGunnery = options.longGunnery;
        this.bombardStrength = options.bombardStrength;
        this.airGroup = options.airGroup;
        this.shortTorpedo = options.shortTorpedo;
        this.mediumTorpedo = options.mediumTorpedo;
        this.spotterPlane = options.spotterPlane;
    }
    print() {
        return (`${this.Id} ${this.Name}`);
    }
    get AirGroup() {
        return this.airGroup;
    }
    hasSpotterPlane() {
        return this.spotterPlane === 'Y';
    }
    isCapitalShip() {
        return CapitalShips.filter(abbreviation => this.id.startsWith(abbreviation)).length > 0;
    }
    isCarrier() {
        return !(this.AirGroup === undefined || this.AirGroup == "");
    }
    get HitCapacity() {
        return this.hitCapacity;
    }
    get ShortGunnery() {
        return this.shortGunnery;
    }
    get MediumGunnery() {
        return this.mediumGunnery;
    }
    get ShortTorpedo() {
        return this.shortTorpedo;
    }
    get MediumTorpedo() {
        return this.mediumTorpedo;
    }
    get LongGunnery() {
        return this.longGunnery;
    }
    get BombardStrength() {
        return this.bombardStrength;
    }
    get LaunchCapacity() {
        return this.launchCapacity;
    }
    get Crippled() {
        return this.crippled;
    }
    setLoaded(loaded) {
        this.loaded = loaded;
    }
    get Loaded() {
        return this.loaded;
    }
}
exports.NavalUnit = NavalUnit;
