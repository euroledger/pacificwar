import { GameStatus } from '../scenarios/GameStatus'
import { Hex } from '../map/Hex'
import { AirUnit } from '../units/AirUnit'
import { NavalUnit } from '../units/NavalUnit'
import { getDieRoll } from '../utils/Utility'
import { AirStrikeTarget } from './AirStrikeTarget'
import { AircraftType } from '../units/Interfaces'
import { AirNavalCombatType } from '../displays/interfaces'
import { AirNavalCombatResultsTable } from '../displays/AirNavalCombatResultsTable'

export enum AirMissionType {
  AirStrike = 'Air Strike',
  AirSupremacy = 'Air Supremacy',
  Ferry = 'Ferry',
  Paradrop = 'Paradrop'
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
    let airStrikeTargets: AirStrikeTarget[] | undefined

    this.airMissionPreliminaryProcedure()
    this.moveMisionAirUnits()
    while (this.currentHex != this.targetHex) {
      await this.doInterceptionProcedure()
    }
    // current hex -> always do search
    if (!this.detected) {
      await this.detectMisionAirUnits(this.targetHex)
    }
    airStrikeTargets = await this.designateStrikeTargets()
    if (!airStrikeTargets) {
      throw Error('No air strike targets designconstated')
    }
    if (this.detected) {
      const capUnit: AirUnit | undefined = this.getCAPUnit()

      const airCombatOptions: AirCombatOptions = {
        coordinated: this.coordinated,
        attackingUnits: this.missionAirUnits,
        defendingUnits: this.targetHex.Force.AirUnits, // todo: Task Forces
        capUnit: capUnit,
        escortUnit: this.getEscortUnit(capUnit != undefined)
      }

      this.capProcedure(airCombatOptions)
      this.flakProcedure()
      if (!this.allMissionUnitsAborted && airStrikeTargets) {
        this.strikeStrafeProcedure(airStrikeTargets)
      }
    } else {
      this.strikeStrafeProcedure(airStrikeTargets)
      this.flakProcedure()
      this.airMissionConclusionProcedure()
    }
  }

  public getAntiAirStrengthModifier(airUnits: AirUnit[], unitToExclude?: AirUnit): number {
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

    return Math.floor(count[0] / 12 + count[1] / 6 + count[2] / 3)
  }
  private getHighestRatedAirUnitByType(airUnits: AirUnit[], type: string) {
    const unitsByType = airUnits.filter((unit) => unit.AircraftType === type)
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
    return this.getHighestRatedAirUnitByType(this.targetHex.Force.AirUnits, AircraftType.F)
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
  public async detectMisionAirUnits(hex: Hex) {
    // only implemented for target hex initially
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

    const CapCombatType = options.coordinated
      ? AirNavalCombatType.CapvsCoordinatedMission
      : AirNavalCombatType.CapvsUncoordinatedMission
      
    const escortCombatType = options.coordinated
      ? AirNavalCombatType.CoordinatedStrikevsCAP
      : AirNavalCombatType.UncoordinatedStrikevsCAP

    let capResult = AirNavalCombatResultsTable.getHitsFor(
      capvsEscortModifiedStrength,
      capvsEscortDieRoll ?? getDieRoll(),
      CapCombatType
    )
    if (capResult.hits === undefined) {
      throw Error(`capvsEscortAirUnits: No result from Air-Naval Combat Results Table`)
    }

    let escortResult = AirNavalCombatResultsTable.getHitsFor(
      escortvsCapModifiedStrength,
      escortvsCapDieRoll ?? getDieRoll(),
      escortCombatType
    )
    if (capResult.hits === undefined) {
      throw Error(`capvsEscortAirUnits: No (CAP vs Escort) result from Air-Naval Combat Results Table`)
    }
    if (escortResult.hits === undefined) {
      throw Error(`capvsEscortAirUnits: No (Escort vs CAP) result from Air-Naval Combat Results Table`)
    }
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

    this.capvsEscortAirUnits(options)
  }

  public async flakProcedure() {}

  public strikeStrafeProcedure(airStrikeTargets: AirStrikeTarget[]) {}

  public distributeHits(group: NavalUnit[], hits: number) {
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

  public async airMissionConclusionProcedure() {}
}
