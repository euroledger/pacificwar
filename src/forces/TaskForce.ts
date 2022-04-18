import { GameStatus } from '../scenarios/GameStatus'
import { Side } from '../units/Interfaces'
import { NavalUnit } from '../units/NavalUnit'


const illegalCoreTypes: string[] = ['CVE', 'ST', 'CA', 'CL', 'DE'] // DD can sometimes be allowed ie if it is carrying troops

const illegalScreenTypes: string[] = ['CV', 'CVL', 'CVS']

export interface TaskForceOptions {
  side: Side
  taskForceId: number
  core?: NavalUnit[]
  screen?: NavalUnit[]
}

export class TaskForce {
  private side!: Side
  private taskForceId!: number
  private core: NavalUnit[] = new Array<NavalUnit>()
  private screen: NavalUnit[] = new Array<NavalUnit>()

  constructor(options?: TaskForceOptions) {
    if (options) {
      if (options.core) {
        for (const ship of options.core) {
          this.addUnitToCore(ship)
        }
      }
      if (options.screen) {
        for (const ship of options.screen) {
          this.addUnitToScreen(ship)
        }
      }
      this.side = options.side
      this.taskForceId = options.taskForceId
    }
  }

  public get Core(): NavalUnit[] {
    return this.core
  }

  public get Screen(): NavalUnit[] {
    return this.screen
  }

  public set TaskForceId(id: number) {
    this.taskForceId = id
  }

  public get TaskForceId(): number {
    return this.taskForceId
  }

  public get Side() {
    return this.side
  }

  public addUnitToCore(unit: NavalUnit) {
    if (this.unitAlreadyInTF(unit)) {
      throw Error(`Unit ${unit.Id} already exists in the task force`)
    }
    if (this.illegalCoreUnit(unit)) {
      throw Error(`Unit ${unit.Id} cannot be in core`)
    }
    if (unit.isCapitalShip() && this.tooManyCapitalShips()) {
      throw Error(
        `Cannot add unit ${unit.Id} to TF: capital ship limit (6) reached`
      )
    }
    if (!unit.isCapitalShip() && this.tooManyNonCapitalShips()) {
      throw Error(
        `Cannot add unit ${unit.Id} to TF: Non-capital ship limit (4) reached`
      )
    }
    this.core.push(unit)
  }

  public addUnitToScreen(unit: NavalUnit) {
    if (this.unitAlreadyInTF(unit)) {
      throw Error(`Unit ${unit.Id} already exists in the task force`)
    }
    if (this.illegalScreenUnit(unit)) {
      throw Error(`Unit ${unit.Id} cannot be in screen`)
    }
    if (this.core.length === this.screen.length) {
      throw Error(
        `Cannot add unit ${unit.Id} to screen - would make screen size bigger than core size`
      )
    }
    if (unit.isCapitalShip() && this.tooManyCapitalShips()) {
      throw Error(
        `Cannot add unit ${unit.Id} to TF: capital ship limit (6) reached`
      )
    }
    if (!unit.isCapitalShip() && this.tooManyNonCapitalShips()) {
      throw Error(
        `Cannot add unit ${unit.Id} to TF: Non-capital ship limit (4) reached`
      )
    }
    if (this.screen.find((x) => x.Id === unit.Id)) {
      throw Error(`Cannot add ${unit.Id} as it is already in the TF`)
    }

    this.screen.push(unit)
  }

  public removeUnitFromCoreById(unitId: string) {
    // check removing unit from core will not make core < screen
    if (
      this.core.find((x) => x.Id === unitId) &&
      this.core.length === this.screen.length
    ) {
      throw Error(
        `Cannot remove Unit ${unitId} as core would contain less units than screen`
      )
    }
    const before = this.core.length
    this.core = this.core.filter((coreUnit) => coreUnit.Id != unitId)
    const after = this.core.length
    if (before === after) {
      throw Error(`Unit ${unitId} not found in TaskForce ${this.TaskForceId}`)
    }
  }

  public removeUnitFromScreenById(unitId: string) {
    const before = this.screen.length
    this.screen = this.screen.filter((screenUnit) => screenUnit.Id != unitId)
    const after = this.screen.length
    if (before === after) {
      throw Error(`Unit ${unitId} not found in TaskForce ${this.TaskForceId}`)
    }
  }

  private illegalCoreUnit(unit: NavalUnit): boolean {
    if (unit.Side === Side.Allied && unit.Id.startsWith('DD')) {
      return true
    }
    if (
      unit.Side === Side.Japan &&
      unit.Id.startsWith('DD') &&
      unit.Loaded === false
    ) {
      return true
    }
    if (
      unit.Side === Side.Allied &&
      unit.Id.startsWith('APD') &&
      unit.Loaded === false
    ) {
      return true
    }
    if (illegalCoreTypes.find((x) => unit.Id.includes(x))) {
      return true
    }
    return false
  }

  private unitAlreadyInTF(unit: NavalUnit): boolean {
    if (
      this.screen.find((x) => x.Id === unit.Id) ||
      this.core.find((x) => x.Id === unit.Id)
    ) {
      return true
    }
    return false
  }

  private illegalScreenUnit(unit: NavalUnit): boolean {
    if (illegalScreenTypes.find((x) => unit.Id.includes(x))) {
      return true
    }

    return false
  }
  private tooManyCapitalShips(): boolean {
    const capitalShipsInCore = this.core.filter((coreUnit) =>
      coreUnit.isCapitalShip()
    )
    const capitalShipsInScreen = this.screen.filter((screenUnit) =>
      screenUnit.isCapitalShip()
    )

    if (capitalShipsInCore.length + capitalShipsInScreen.length === 6) {
      return true
    }
    return false
  }

  private tooManyNonCapitalShips(): boolean {
    const numNonCapitalShipsInCore = this.core.filter(
      (coreUnit) => !coreUnit.isCapitalShip()
    ).length
    const numNonCapitalShipsInScreen = this.screen.filter(
      (screenUnit) => !screenUnit.isCapitalShip()
    ).length
    if (numNonCapitalShipsInCore + numNonCapitalShipsInScreen === 4) {
      return true
    }
    return false
  }

  public print() {
    GameStatus.print(`\t\t         ${this.Side} TASK FORCE ${this.taskForceId}`)
    GameStatus.print(
      '================================================================'
    )
    GameStatus.print(`\t\tCORE\t\t\tSCREEN`)
    GameStatus.print(`\t\t----\t\t\t------`)

    const numRowsToDisplay = Math.max(this.Core.length, this.Screen.length)

    for (let i = 0; i< numRowsToDisplay; i++) {
      let coreShipStr = ''
      let screenShipStr = ''

      if (i < this.Core.length) {
        coreShipStr = `${this.Core[i].Id}-${this.Core[i].Name}`
      }
      if (i < this.Screen.length) {
        screenShipStr = `${this.Screen[i].Id}-${this.Screen[i].Name}`
      }
      GameStatus.print(`\t\t${coreShipStr}\t\t${screenShipStr}`)
    }
  }
}
