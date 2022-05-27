import { DetectionLevel } from '../displays/SearchCharts'
import { Main } from '../main'
import { GameStatus } from '../scenarios/GameStatus'
import { AirUnit } from '../units/AirUnit'
import { Side } from '../units/Interfaces'
import { NavalUnit } from '../units/NavalUnit'
import { random } from '../utils/Utility'

type ShipCountByType = {
  [key: string]: number
}

export interface ReconInformation {}

export interface RedReconInformation extends ReconInformation {
  numberNavalUnits: number
}

export interface BlueReconInformation extends ReconInformation {
  numberCapitalShips: number
  numberNonCapitalShips: number
  carriers: boolean
}

export interface GreenReconInformation extends ReconInformation {
  unitReport: ShipCountByType[] // array of unit type -> number pairs eg 'BB' -> 2, 'CV' -> 3 etc.
}

const illegalCoreTypes: Readonly<string[]> = ['CVE', 'ST', 'CA', 'CL', 'DE'] // DD can sometimes be allowed ie if it is carrying troops

const illegalScreenTypes: Readonly<string[]> = ['CV', 'CVL', 'CVS']

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

  public getNumberOfNavalUnitsPlusMinus50(): number {
    const numShips = this.core.concat(this.screen)

    const lower = numShips.length - Math.floor(numShips.length / 2)
    const upper = numShips.length + Math.floor(numShips.length / 2)
    return random(lower, upper)
  }

  public getNumberOfCapitalShips(): number {
    return this.core.concat(this.screen).filter((unit) => unit.isCapitalShip()).length
  }

  public getNumberOfNonCapitalShips(): number {
    return this.core.concat(this.screen).filter((unit) => !unit.isCapitalShip()).length
  }

  public getPresenceOfCarriers(): boolean {
    return this.core.concat(this.screen).filter((unit) => unit.isCarrier()).length > 0
  }

  public getNumberAndTypesOfAllNavalUnits(): ShipCountByType[] {
    let count: ShipCountByType[] = []

    this.core.concat(this.screen).forEach((el) => {
      if (el.NavalUnitType) {
        count[el.NavalUnitType] = ++count[el.NavalUnitType] || 1
      }
    })
    return count
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
      throw Error(`Cannot add unit ${unit.Id} to TF: capital ship limit (6) reached`)
    }
    if (!unit.isCapitalShip() && this.tooManyNonCapitalShips()) {
      throw Error(`Cannot add unit ${unit.Id} to TF: Non-capital ship limit (4) reached`)
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
      throw Error(`Cannot add unit ${unit.Id} to screen - would make screen size bigger than core size`)
    }
    if (unit.isCapitalShip() && this.tooManyCapitalShips()) {
      throw Error(`Cannot add unit ${unit.Id} to TF: capital ship limit (6) reached`)
    }
    if (!unit.isCapitalShip() && this.tooManyNonCapitalShips()) {
      throw Error(`Cannot add unit ${unit.Id} to TF: Non-capital ship limit (4) reached`)
    }
    if (this.screen.find((x) => x.Id === unit.Id)) {
      throw Error(`Cannot add ${unit.Id} as it is already in the TF`)
    }

    this.screen.push(unit)
  }

  public removeUnitFromCoreById(unitId: string) {
    // check removing unit from core will not make core < screen
    if (this.core.find((x) => x.Id === unitId) && this.core.length === this.screen.length) {
      throw Error(`Cannot remove Unit ${unitId} as core would contain less units than screen`)
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

  // get all the air units from carriers in the task force
  public get AirUnits(): AirUnit[] {
    const allUnits = this.core.concat(this.screen)
    const airUnits: AirUnit[] = new Array<AirUnit>()
    for (const unit of allUnits) {
      if (unit.Id.startsWith('CV')) {
        // get the Carrier Air Unit for that carrier
        const carrierAirGroup = Main.Mapper.getUnitById<AirUnit>(this.side, unit.AirGroup)
        airUnits.push(carrierAirGroup)
      }
    }
    return airUnits
  }

  private illegalCoreUnit(unit: NavalUnit): boolean {
    if (unit.Side === Side.Allied && unit.Id.startsWith('DD')) {
      return true
    }
    if (unit.Side === Side.Japan && unit.Id.startsWith('DD') && unit.Loaded === false) {
      return true
    }
    if (unit.Side === Side.Allied && unit.Id.startsWith('APD') && unit.Loaded === false) {
      return true
    }
    if (illegalCoreTypes.find((x) => unit.Id.includes(x))) {
      return true
    }
    return false
  }

  private unitAlreadyInTF(unit: NavalUnit): boolean {
    if (this.screen.find((x) => x.Id === unit.Id) || this.core.find((x) => x.Id === unit.Id)) {
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
    const capitalShipsInCore = this.core.filter((coreUnit) => coreUnit.isCapitalShip())
    const capitalShipsInScreen = this.screen.filter((screenUnit) => screenUnit.isCapitalShip())

    if (capitalShipsInCore.length + capitalShipsInScreen.length === 6) {
      return true
    }
    return false
  }

  private tooManyNonCapitalShips(): boolean {
    const numNonCapitalShipsInCore = this.core.filter((coreUnit) => !coreUnit.isCapitalShip()).length
    const numNonCapitalShipsInScreen = this.screen.filter((screenUnit) => !screenUnit.isCapitalShip()).length
    if (numNonCapitalShipsInCore + numNonCapitalShipsInScreen === 4) {
      return true
    }
    return false
  }

  public getReconInformation(detectionLevel: DetectionLevel): ReconInformation | undefined {
    const reconnaisanceMap = new Map([
      [DetectionLevel.detectedRed, { numberNavalUnits: this.getNumberOfNavalUnitsPlusMinus50() }],
      [
        DetectionLevel.detectedBlue,
        {
          numberCapitalShips: this.getNumberOfCapitalShips(),
          numberNonCapitalShips: this.getNumberOfNonCapitalShips(),
          carriers: this.getPresenceOfCarriers()
        }
      ],
      [DetectionLevel.detectedGreen, { unitReport: this.getNumberAndTypesOfAllNavalUnits() }]
    ])
    // use the map to get the correct object -> return this
    return reconnaisanceMap.get(detectionLevel)
  }

  public printRedReconInfo(taskForceId: string) {
    GameStatus.print(`\t\t\t\tTask Force ${taskForceId} - Reconnaisance Info For Detection Level RED`)
    GameStatus.print('\t\t\t\t====================================================')
    GameStatus.print(`\t\t\t\t\t=> Number of naval units in task force: ${this.getNumberOfNavalUnitsPlusMinus50()}`)
    GameStatus.print(`\n`)
  }

  public printBlueReconInfo(taskForceId: string) {
    GameStatus.print(`\t\t\t\tTask Force ${taskForceId} - Reconnaisance Info For Detection Level BLUE`)
    GameStatus.print('\t\t\t\t=====================================================================')
    GameStatus.print(`\t\t\t\t\t=>Number of capital ship units in task force: ${this.getNumberOfCapitalShips()}`)
    GameStatus.print(`\t\t\t\t\t=>Number of non-capital ship units in task force: ${this.getNumberOfNonCapitalShips()}`)
    GameStatus.print(
      `\t\t\t\t\t=>Aircraft Carriers present in TF: ${this.getPresenceOfCarriers() === true ? 'YES' : 'NO'}`
    )

    GameStatus.print(`\n`)
  }

  public printGreenReconInfo(taskForceId: string) {
    const types = this.getNumberAndTypesOfAllNavalUnits()
    GameStatus.print(`\t\t\t\tTask Force ${taskForceId} - Reconnaisance Info For Detection Level GREEN`)
    GameStatus.print('\t\t\t\t=====================================================================')
    GameStatus.print(`\t\t\t\tNumber and Types of naval units in task force: \n`)
    for (const key of Object.keys(types)) {
      GameStatus.print(`\t\t\t\t\t${key}: ${types[key]}`)
    }
    GameStatus.print(`\n`)
  }
  public print() {
    GameStatus.print(`\t\t         ${this.Side} TASK FORCE ${this.taskForceId}`)
    GameStatus.print('\t\t\t\t=====================================================================')

    GameStatus.print(`\t\tCORE\t\t\tSCREEN`)
    GameStatus.print(`\t\t----\t\t\t------`)

    const numRowsToDisplay = Math.max(this.Core.length, this.Screen.length)

    for (let i = 0; i < numRowsToDisplay; i++) {
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
