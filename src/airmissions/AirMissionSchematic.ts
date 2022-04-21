import { GameStatus } from '../scenarios/GameStatus'
import { Hex } from '../scenarios/Hex'
import { PacificWarScenario } from '../scenarios/Scenario'
import { AirUnit } from '../units/AirUnit'
import { getDieRoll } from '../utils/Utility'

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
  protected coordinated: boolean = false
  protected detected: boolean = false

  constructor(options: AirMissionSchematicOptions) {
    this.missionAirUnits = options.missionAirUnits
    this.startHex = options.startHex
    this.targetHex = options.targetHex
    this.airMissionType = options.airMissionType
  }

  public doAirMission() {
    this.airMissionPreliminaryProcedure()
    this.moveMisionAirUnits()
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
    GameStatus.print("\t\t\t\Coordination Die Roll => ", dieRoll)

    if (dieRoll <= minLevelOfAirUnits * 3)  {
      GameStatus.print("\t\t\t\Mission is COORDINATED")
      return true
    }
    GameStatus.print("\t\t\t\Mission is UNCOORDINATED")
    return false
  }

  public getLowestStatusLevelOfMissionAirUnits(): number {
    return Math.min(...this.missionAirUnits.map(airUnit => airUnit.AircraftLevel));
  }

  public airMissionPreliminaryProcedure(dieRoll?: number) {
    GameStatus.print("\t\t\tMission Type is", this.airMissionType)
    if (!dieRoll)  {
      dieRoll = getDieRoll()
    }
    this.coordinated = this.isCoordinated(dieRoll)
  }

  public moveMisionAirUnits() {
    // todo
    // call detectMisionAirUnits in each hex - if there are enemy units the strike could be detected
  }

  // in future this would involve air units moving hex by hex and possibly being detected before the target hex
  public detectMisionAirUnits(hex: Hex) {
    // only implemented for target hex initially
  }
}
