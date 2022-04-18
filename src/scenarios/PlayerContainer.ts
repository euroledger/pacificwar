import { AbstractUnit as AbstractUnit } from "../units/AbstractUnit";
import { Side } from "../units/Interfaces";
import { NavalUnit } from "../units/NavalUnit";

export class PlayerContainer {
    private side!: Side
    private units!: AbstractUnit[]
    private taskForces!: NavalUnit[]
    private forces!: AbstractUnit[]

    constructor(side: Side, units: AbstractUnit[]) {
        this.side = side;
        this.units = units
    }

    get Units(): AbstractUnit[] {
        return this.units
    }
}