import { Hex } from '../scenarios/Hex'
import { PacificWarScenario } from '../scenarios/Scenario'
import { AirUnit } from '../units/AirUnit'

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
  protected coordinated!: boolean

  constructor(options: AirMissionSchematicOptions) {
    this.missionAirUnits = options.missionAirUnits
    this.startHex = options.startHex
    this.targetHex = options.targetHex
    this.airMissionType = options.airMissionType
    if (options.coordinated) {
      this.coordinated = options.coordinated
    }
  }
  
  public doAirMission() {
    this.airMissionPreliminaryProcedure()
  }

  public isCoordinated(): boolean {
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
    return true
    // coordination die roll
  }

  public airMissionPreliminaryProcedure() {
    this.coordinated = this.isCoordinated()
  }
}
