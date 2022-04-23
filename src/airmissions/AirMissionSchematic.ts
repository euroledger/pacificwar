import { GameStatus } from '../scenarios/GameStatus'
import { Hex } from '../map/Hex'
import { PacificWarScenario } from '../scenarios/Scenario'
import { AirUnit } from '../units/AirUnit'
import { NavalUnit } from '../units/NavalUnit'
import { getDieRoll } from '../utils/Utility'
import { AirStrikeTarget } from './AirStrikeTarget'

export enum AirMissionType {
  AirStrike = 'Air Strike',
  AirSupremacy = 'Air Supremacy',
  Ferry = 'Ferry',
  Paradrop = 'Paradrop',
}

export interface AirMissionSchematicOptions {
  airMissionType: AirMissionType
  missionAirUnits: AirUnit[]
  startHex: Hex
  targetHex: Hex
  coordinated?: boolean
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
    if (this.detected) {
      if (this.currentHex != this.targetHex) {
        this.doInterceptionProcedure()
        // add loop to continue movement
      } else {
        airStrikeTargets = await this.designateStrikeTargets()
        this.capProcedure()
        this.flakProcedure()
        if (!this.allMissionUnitsAborted && airStrikeTargets) {
          this.strikeStrafeProcedure(airStrikeTargets)
        }
      }
    }
    airStrikeTargets = await this.designateStrikeTargets()
    if (!airStrikeTargets) {
      throw Error("No air strike targets designated")
    }
    this.strikeStrafeProcedure(airStrikeTargets)
    this.flakProcedure()
    this.airMissionConclusionProcedure()
  }

  public isCoordinated(dieRoll: number): boolean {
    if (
      this.airMissionType === AirMissionType.AirSupremacy ||
      this.missionAirUnits.length === 1
    ) {
      return true
    }
    if (
      this.airMissionType === AirMissionType.Ferry ||
      this.airMissionType === AirMissionType.Paradrop
    ) {
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
    return Math.min(
      ...this.missionAirUnits.map((airUnit) => airUnit.AircraftLevel)
    )
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
  public async capProcedure() {

  }
  public async flakProcedure() {

  }

  public strikeStrafeProcedure(airStrikeTargets: AirStrikeTarget[]) {

  }

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
      if (navalUnit.Hits === navalUnit.HitCapacity -1 && navalUnit.CanBeCrippled) {
        GameStatus.print(`\t\t\t\t\t\t=> ${navalUnit.Id} ${navalUnit.Name} is CRIPPLED!`)
        navalUnit.Crippled = true
      }
    }
  }
  
  public async airMissionConclusionProcedure() {

  }
}
