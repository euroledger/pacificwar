// this container holds ground units, bases, air units etc, non-activated naval units and
// store location as a hex objct
// hex object will have forces in it as well (two-way references)

import { GameStatus } from '../scenarios/GameStatus'
import { Hex } from '../map/Hex'
import { AbstractUnit } from '../units/AbstractUnit'
import { AirUnit } from '../units/AirUnit'
import { BaseUnit } from '../units/BaseUnit'
import { ActivationStatus, Side } from '../units/Interfaces'
import { NavalUnit } from '../units/NavalUnit'

export interface ForceOptions {
  side: Side
  forceId: number
  units: AbstractUnit[]
  location: Hex
}

export class Force {
  private side!: Side
  private forceId!: number
  private location!: Hex
  private units: AbstractUnit[] = new Array<AbstractUnit>()

  constructor(options?: ForceOptions) {
    if (options) {
      if (options.units) {
        this.units = this.units.concat(options.units)
      }
      this.side = options.side
      this.forceId = options.forceId
      this.location = options.location
    }
  }

  public addUnitToForce(unit: AbstractUnit) {
    if (this.unitAlreadyInForce(unit)) {
      throw Error(`Unit ${unit.Id} already exists in the force`)
    }
    this.units.push(unit)
  }

  public removeUnitFromForceById(unitId: string) {
    GameStatus.print(this.units)
    console.log()
    const found = this.units.find((unit) => unit.Id === unitId) != undefined

    GameStatus.print("found = ", found)
    if (!found) {
      throw Error(`Unit ${unitId} not found in Force ${this.ForceId}`)
    }
    this.units = this.units.filter((unit) => unit.Id != unitId) 
  }

  public set ForceId(id: number) {
    this.ForceId = id
  }

  public get ForceId(): number {
    return this.forceId
  }

  public get Side() {
    return this.side
  }

  public get Units(): AbstractUnit[] {
    return this.units
  }

  public get Location(): Hex {
    return this.location
  }

  public getActivatedUnits(): AbstractUnit[] {
    return this.units.filter(
      (unit) => unit.ActivationStatus === ActivationStatus.Activated
    )
  }

  public getDeactivatedUnits(): AbstractUnit[] {
    return this.units.filter(
      (unit) => unit.ActivationStatus === ActivationStatus.Deactivated
    )
  }

  public getUnactivatedUnits(): AbstractUnit[] {
    return this.units.filter(
      (unit) => unit.ActivationStatus === ActivationStatus.Unactivated
    )
  }

  private unitAlreadyInForce(unit: AbstractUnit): boolean {
    return this.units.find((x) => x.Id === unit.Id) != undefined
  }

  public get AirUnits(): AirUnit[] {
    return this.units.filter((x) => x.isAirUnit()) as AirUnit[]
  }

  public get NavalUnits(): NavalUnit[] {
    return this.units.filter((x) => x.isNavalUnit()) as NavalUnit[]
  }

  public get BaseUnit(): BaseUnit | undefined {
    const base = this.units.filter((x) => x.isBaseUnit()) 
    if (base.length === 1) {
      return base[0] as BaseUnit
    }
  }

  public print() {
    GameStatus.print(`\t\t      ${this.Side} FORCE ${this.forceId} LOCATION ${this.location.HexNumber}`)
    GameStatus.print(
      '================================================================================================='
    )
    if (this.BaseUnit) {
      GameStatus.print('\n')
      GameStatus.print(`\t\t    BASE UNIT: ${this.BaseUnit.print()}`)
      GameStatus.print('\n')
    }
    GameStatus.print(`\t\tNAVAL UNITS\t\t\t\tAIR UNITS`)
    GameStatus.print(`\t\t-----------\t\t\t\t---------`)

    const numRowsToDisplay = Math.max(this.NavalUnits.length, this.AirUnits.length)

    for (let i = 0; i< numRowsToDisplay; i++) {
      let navalUnitStr = ''
      let airUnitStr = ''

      if (i < this.NavalUnits.length) {
        navalUnitStr = `${this.NavalUnits[i].Id}-${this.NavalUnits[i].Name}`
      }
      let tabs = '\t\t\t'
      if (navalUnitStr.length < 17) {
        tabs = '\t\t\t\t'
      }

      if (i < this.AirUnits.length) {
        airUnitStr = `${this.AirUnits[i].print()}`
      }
      GameStatus.print(`\t\t${navalUnitStr}${tabs}${airUnitStr}`)
    }
  }
}
