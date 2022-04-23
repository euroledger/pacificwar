import { AirNavalCombatType } from "../displays/AirNavalCombatResultsTable";
import { AirUnit } from "../units/AirUnit";
import { NavalUnit } from "../units/NavalUnit";

export interface AirStrikeTargetOptions {
  attacker: AirUnit, 
  combatType: AirNavalCombatType,
  airTarget?: AirUnit, 
  navalTargets?: NavalUnit[]
}
export class AirStrikeTarget {
  private attacker: AirUnit
  private combatType: AirNavalCombatType
  private targetAirUnit!: AirUnit
  private navalTargets!: NavalUnit[]

  constructor(options: AirStrikeTargetOptions) {
    this.attacker = options.attacker
    this.combatType = options.combatType
    if (options.airTarget) {
      this.targetAirUnit = options.airTarget
    }
    if (options.navalTargets) {
      this.navalTargets = options.navalTargets 
    }
  }

  public get Attacker(): AirUnit {
    return this.attacker
  }

  public get AirTarget(): AirUnit {
    return this.targetAirUnit
  }

  public get NavalTargets(): NavalUnit[] {
    return this.navalTargets
  }

  public get AirNavalCombatType():AirNavalCombatType {
    return this.combatType
  }
}