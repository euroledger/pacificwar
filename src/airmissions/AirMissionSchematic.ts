import { GameStatus } from '../scenarios/GameStatus'
import { Hex } from '../map/Hex'
import { AirUnit } from '../units/AirUnit'
import { NavalUnit } from '../units/NavalUnit'
import { getDieRoll } from '../utils/Utility'
import { AirStrikeTarget } from './AirStrikeTarget'
import { AircraftType } from '../units/Interfaces'
import { AirNavalCombatType } from '../displays/interfaces'
import { AirCombatResult, AirNavalCombatResultsTable } from '../displays/AirNavalCombatResultsTable'
import { DetectionLevel, SearchChart, SearchOptions, TimeOfDay } from '../displays/SearchCharts'
import { alliedAirSearchChartResults } from '../displays/AlliedSearchTables'
import { AbstractUnit } from '../units/AbstractUnit'

export enum AirMissionType {
  AirStrike = 'Air Strike',
  AirSupremacy = 'Air Supremacy',
  Ferry = 'Ferry',
  Paradrop = 'Paradrop'
}

export type AirCombatResults = {
  hitsvsEscort: number
  hitsvsCap: number
}

export interface AirMissionSchematicOptions {
  airMissionType: AirMissionType
  missionAirUnits: AirUnit[]
  startHex: Hex
  targetHex: Hex
  coordinated?: boolean
}

export interface AirCombatOptions {
  defendingUnits: AirUnit[] // get defending fighters from here
  coordinated: boolean
  capUnit?: AirUnit
  attackingUnits: AirUnit[] // get attacking fighters from here
  escortUnit?: AirUnit
  interception?: boolean
}

export class AirMissionSchematic {
  protected airMissionType: AirMissionType
  protected missionAirUnits: AirUnit[]
  protected startHex: Hex
  protected targetHex: Hex
  protected currentHex!: Hex
  protected coordinated: boolean = false
  protected detected: boolean = false
  protected allMissionUnitsAborted: boolean = false

  constructor(options: AirMissionSchematicOptions) {
    this.missionAirUnits = options.missionAirUnits
    this.startHex = options.startHex
    this.targetHex = options.targetHex
    this.airMissionType = options.airMissionType
  }

  public async doAirMission() {
    GameStatus.airMissionConcluded = false

    let airStrikeTargets: AirStrikeTarget[] | undefined

    this.airMissionPreliminaryProcedure()
    this.moveMisionAirUnits()
    while (this.currentHex != this.targetHex) {
      await this.doInterceptionProcedure()
    }
    // current hex -> always do search
    if (!this.detected) {
      this.detected = (await this.detectMisionAirUnits(this.targetHex)) !== DetectionLevel.undetected
    }
    airStrikeTargets = await this.designateStrikeTargets()
    if (!airStrikeTargets) {
      throw Error('No air strike targets designated')
    }
    if (this.detected) {
      GameStatus.print('\n')
      GameStatus.print('\t\t\tResolve CAP')
      GameStatus.print('\t\t\t------------')

      const capUnit: AirUnit | undefined = this.getCAPUnit()

      const airCombatOptions: AirCombatOptions = {
        coordinated: this.coordinated,
        attackingUnits: this.missionAirUnits,
        defendingUnits: this.targetHex.CapAirUnits,
        capUnit: capUnit,
        escortUnit: this.getEscortUnit(capUnit != undefined)
      }

      this.capProcedure(airCombatOptions)

      GameStatus.print('\n\t\t\tResolve Flak')
      GameStatus.print('\t\t\t------------')
      await this.flakProcedure(airCombatOptions)
      if (!this.allMissionUnitsAborted && airStrikeTargets) {
        this.strikeStrafeProcedure(airStrikeTargets)
      }
    } else {
      const airCombatOptions: AirCombatOptions = {
        coordinated: this.coordinated,
        attackingUnits: this.missionAirUnits,
        defendingUnits: this.targetHex.CapAirUnits,
        capUnit: undefined,
        escortUnit: undefined
      }
      this.strikeStrafeProcedure(airStrikeTargets)
      // note: no CAP air-to-air combat if mission undetected
      await this.flakProcedure(airCombatOptions)
      this.airMissionConclusionProcedure()
    }
  }

  public getAntiAirStrengthModifier(airUnits: AirUnit[], unitToExclude?: AirUnit): number {
    if (!airUnits || airUnits.length === 0) {
      return 0
    }
    let otherUnits: AirUnit[] = new Array<AirUnit>()
    if (unitToExclude) {
      otherUnits = this.getOtherAirUnits(airUnits, unitToExclude)
    }
    const count: number[] = [0, 0, 0]

    otherUnits.forEach((el) => {
      if (el.AircraftType === AircraftType.F) {
        count[el.AircraftLevel] += el.Steps
      }
    })

    const L0modifier = Math.floor(count[0] / 12)
    const L1modifier = Math.floor(count[1] / 6)
    const L2modifier = Math.floor(count[2] / 3)
    return L0modifier + L1modifier + L2modifier
  }

  private getHighestRatedAirUnitByType(airUnits: AirUnit[], type: string): AirUnit | undefined{
    const unitsByType = airUnits.filter((unit) => unit.AircraftType === type)
    if (unitsByType.length === 0) {
      return undefined
    }
    return unitsByType.reduce((previousValue, nextValue) => {
      return previousValue.AAStrength > nextValue.AAStrength ? previousValue : nextValue
    })
  }

  public getEscortUnit(cap: boolean): AirUnit | undefined {
    // default is to use the highest rated fighter as Escort...will be overridden by subclasses
    let escort = this.getHighestRatedAirUnitByType(this.missionAirUnits, AircraftType.F)

    // if no cap escort must be an F unit
    if (!escort && cap) {
      escort = this.getHighestRatedAirUnitByType(this.missionAirUnits, AircraftType.T)
    }
    if (!escort && cap) {
      escort = this.getHighestRatedAirUnitByType(this.missionAirUnits, AircraftType.B)
    }
    return escort
  }

  public getOtherAirUnits(allUnits: AirUnit[], unitToRemove: AirUnit): AirUnit[] {
    const newarray = allUnits.filter((unit) => unit.Id !== unitToRemove.Id)
    return newarray
  }

  public getCAPUnit(): AirUnit | undefined {
    // default is to use the highest rated fighter as CAP...will be overridden by subclasses
    return this.getHighestRatedAirUnitByType(this.targetHex.CapAirUnits, AircraftType.F)
  }

  public isCoordinated(dieRoll: number): boolean {
    if (this.airMissionType === AirMissionType.AirSupremacy || this.missionAirUnits.length === 1) {
      return true
    }
    if (this.airMissionType === AirMissionType.Ferry || this.airMissionType === AirMissionType.Paradrop) {
      return false
    }
    // coordination die roll
    const minLevelOfAirUnits = this.getLowestStatusLevelOfMissionAirUnits()
    GameStatus.print('\n')
    GameStatus.print('\t\t\tCoordination Die Roll => ', dieRoll)

    if (dieRoll <= minLevelOfAirUnits * 3) {
      GameStatus.print('\t\t\tMission is COORDINATED')
      return true
    }
    GameStatus.print('\t\t\tMission is UNCOORDINATED')
    return false
  }

  public getLowestStatusLevelOfMissionAirUnits(): number {
    return Math.min(...this.missionAirUnits.map((airUnit) => airUnit.AircraftLevel))
  }

  public airMissionPreliminaryProcedure(dieRoll?: number) {
    GameStatus.print('\n')
    GameStatus.print('\t\t\tMission Type is', this.airMissionType)
    if (!dieRoll) {
      dieRoll = getDieRoll()
    }
    this.coordinated = this.isCoordinated(dieRoll)
  }

  public async doInterceptionProcedure() {
    // todo
    this.currentHex = this.targetHex // temporary -> will do on hex at a time in future
  }

  public async moveMisionAirUnits() {
    this.detectMisionAirUnits(this.targetHex)
    // todo
    // call detectMisionAirUnits in each hex - if there are enemy units the strike could be detected
  }

  // in future this would involve air units moving hex by hex and possibly being detected before the target hex
  public async detectMisionAirUnits(hex: Hex): Promise<DetectionLevel> {
    // only implemented for target hex initially
    const dieRoll = getDieRoll()
    let options: SearchOptions = {
      airSearchTable: alliedAirSearchChartResults,
      range: 0,
      dieRoll,
      timeOfDay: TimeOfDay.Day
    }

    let result: DetectionLevel = SearchChart.searchForAir(options)
    const resultStr = result === DetectionLevel.undetected ? 'NOT DETECTED' : 'DETECTED'
    GameStatus.print('\n\t\t\t\t => Search Die Roll is ' + dieRoll)
    GameStatus.print('\t\t\t\t => Result is ' + resultStr)

    return result
  }

  public async designateStrikeTargets(): Promise<AirStrikeTarget[] | undefined> {
    return undefined
  }

  public interceptingvsMissionAirUnits() {}

  public escortvsAlertedAirUnits() {}

  public capvsEscortAirUnits(
    options: AirCombatOptions,
    capvsEscortDieRoll?: number,
    escortvsCapDieRoll?: number
  ): {
    hitsvsEscort: number
    hitsvsCap: number
  } {
    const defendingDrm = this.getAntiAirStrengthModifier(options.defendingUnits, options.capUnit)
    const attackingDrm = this.getAntiAirStrengthModifier(options.attackingUnits, options.escortUnit)

    if (!options.escortUnit) {
      throw Error('No escort unit declared in escort vs CAP air combat')
    }
    if (!options.capUnit) {
      throw Error('No CAP unit declared in escort vs CAP air combat')
    }
    const capvsEscortModifiedStrength = options.capUnit.AAStrength + defendingDrm
    const escortvsCapModifiedStrength = options.escortUnit.AAStrength + attackingDrm

    GameStatus.print('\n')
    GameStatus.print(`\t\t\tUS CAP Unit is ${options.capUnit.Id} - AA Strength ${options.capUnit.AAStrength}`)
    GameStatus.print(`\t\t\tDefending Strength Modifier is ${defendingDrm}`)
    GameStatus.print(`\t\t\t => Final Modified Strength =  ${capvsEscortModifiedStrength}`)

    GameStatus.print(
      `\n\t\t\tJapanese Escort Unit is ${options.escortUnit.Id} - AA Strength ${options.escortUnit.AAStrength}`
    )
    GameStatus.print(`\t\t\tDefending Strength Modifier is ${attackingDrm}`)
    GameStatus.print(`\t\t\t => Final Modified Strength =  ${escortvsCapModifiedStrength}`)

    const CapCombatType = options.coordinated
      ? AirNavalCombatType.CapvsCoordinatedMission
      : AirNavalCombatType.CapvsUncoordinatedMission

    const escortCombatType = options.coordinated
      ? AirNavalCombatType.CoordinatedStrikevsCAP
      : AirNavalCombatType.UncoordinatedStrikevsCAP

    const defenderDieRoll = capvsEscortDieRoll ?? getDieRoll()
    GameStatus.print(`\n\t\t\t =>  Defender (CAP) Die Roll =  ${defenderDieRoll}`)

    let capResult = AirNavalCombatResultsTable.getHitsFor(capvsEscortModifiedStrength, defenderDieRoll, CapCombatType)
    if (capResult.hits === undefined) {
      throw Error(`capvsEscortAirUnits: No result from Air-Naval Combat Results Table`)
    }
    GameStatus.print(`\t\t\t =>  Defender (CAP) Hits =  ${capResult.hits}`)

    const attackerDieRoll = escortvsCapDieRoll ?? getDieRoll()
    GameStatus.print(`\t\t\t =>  Attacker (Air Mission Escort) Die Roll =  ${attackerDieRoll}`)

    let escortResult = AirNavalCombatResultsTable.getHitsFor(
      escortvsCapModifiedStrength,
      attackerDieRoll,
      escortCombatType
    )
    if (capResult.hits === undefined) {
      throw Error(`capvsEscortAirUnits: No (CAP vs Escort) result from Air-Naval Combat Results Table`)
    }
    if (escortResult.hits === undefined) {
      throw Error(`capvsEscortAirUnits: No (Escort vs CAP) result from Air-Naval Combat Results Table`)
    }
    GameStatus.print(`\t\t\t =>  Attacker (Air Mission Escort) Hits =  ${escortResult.hits}`)

    return { hitsvsEscort: capResult.hits, hitsvsCap: escortResult.hits }
  }

  public async capProcedure(options: AirCombatOptions) {
    // three possible ways air combat can occur
    // 1. Intercepting unit v Mission air units
    // 2. Escort v Defending (alerted) air units when there is no CAP
    // 3. CAP v Escort and vice versa (simultaneously)
    if (options.interception) {
      this.interceptingvsMissionAirUnits()
      return
    }
    if (options.escortUnit && !options.capUnit) {
      this.escortvsAlertedAirUnits()
      return
    }

    const result = this.capvsEscortAirUnits(options)
    this.allocateAirCombatHits(result, options)
  }

  public allocateAirCombatHits(result: AirCombatResults, options: AirCombatOptions) {}

  public async getFlakHits(aaStrength: number, dieRoll?: number): Promise<AirCombatResult> {

    const roll = dieRoll ?? getDieRoll()
    GameStatus.print(`\t\t\t\t=> Die Roll: ${roll} `)

    let flakResult = AirNavalCombatResultsTable.getHitsFor(
      aaStrength,
      roll,
      AirNavalCombatType.UnimprovedFlakvsAir
    )
    GameStatus.print(`\t\t\t\t=> Hits: ${flakResult.hits} `)

    return flakResult
  }
  public async flakProcedure(airCombatOptions: AirCombatOptions, dieRoll?: number): Promise<void> {
    const flakUnits = this.determineFlakUnits()
    const aaStrength = this.calculateFlakStrength(flakUnits)
    GameStatus.print(`\t\t\t\t=> Total Flak Strength: ${aaStrength}`)
    const result = await this.getFlakHits(aaStrength, dieRoll)
    if (!result.hits) {
      throw Error (`No result from getFlakHits, aaStrength ${aaStrength}, dieRoll ${dieRoll}`)
    }
    this.allocateFlakHits(result.hits, airCombatOptions)
  }

  public allocateFlakHits(hits: number, options: AirCombatOptions) {
  }

  // todo add task forces to the method
  public determineFlakUnits(): AbstractUnit[] {
    let flakUnits = new Array<AbstractUnit>()

    if (!this.targetHex.Force) {
      return []
    }

    const groundUnits: AbstractUnit[] = this.targetHex.Force.GroundUnits as AbstractUnit[]
    flakUnits = flakUnits.concat(groundUnits)

    // get the 4 naval units with highest anti-air strength
    let navalUnits: AbstractUnit[] = this.targetHex.Force.NavalUnits as AbstractUnit[]
    navalUnits = navalUnits.sort((a, b) => b.AAStrength - a.AAStrength)
    navalUnits = navalUnits.slice(0, Math.min(navalUnits.length, 4))

    flakUnits = flakUnits.concat(navalUnits)

    const baseUnit: AbstractUnit = this.targetHex.Force.BaseUnit as AbstractUnit
    flakUnits.push(baseUnit)

    GameStatus.print(`\t\t\t\t=> Units Used For Flak:`)

    for (const unit of flakUnits) {
      GameStatus.print(`\t\t\t\t\t=> ${unit.Id} ${unit.Name} (Hits ${unit.Hits}) AA Strength => ${unit.AAStrength}`)
    }
    return flakUnits
  }

  public calculateFlakStrength(units: AbstractUnit[]): number {
    return units.reduce((sum, current) => sum + Math.max(current.AAStrength, 0), 0)
  }

  public strikeStrafeProcedure(airStrikeTargets: AirStrikeTarget[]) {}

  public distributeHits(group: NavalUnit[], hits: number) {
    if (group.length == 0) {
      return // can happen in tests
    }
    // allocate hits evenly across group according to priority
    for (let index = 0; index < hits; index++) {
      const navalUnit = group[index % group.length]
      if (navalUnit.Sunk === false) {
        navalUnit.Hits += 1
      }
    }

    for (const navalUnit of group) {
      const pluralStr = navalUnit.Hits === 1 ? '' : 's'
      GameStatus.print(`\t\t\t\t\t=> ${navalUnit.Id} ${navalUnit.Name} now has ${navalUnit.Hits} hit${pluralStr}`)
      if (navalUnit.Hits >= navalUnit.HitCapacity) {
        GameStatus.print(`\t\t\t\t\t\t=> ${navalUnit.Id} ${navalUnit.Name} is SUNK!`)
        navalUnit.Sunk = true
      }
      if (navalUnit.Hits === navalUnit.HitCapacity - 1 && navalUnit.CanBeCrippled) {
        GameStatus.print(`\t\t\t\t\t\t=> ${navalUnit.Id} ${navalUnit.Name} is CRIPPLED!`)
        navalUnit.Crippled = true
      }
    }
  }

  public async airMissionConclusionProcedure() {
    GameStatus.airMissionConcluded = true
  }

  public get Detected(): boolean {
    return this.detected
  }

  public set Detected(detected: boolean) {
    this.detected = detected
  }
}
