import { LightingCondition, LightingConditionDisplay } from '../../displays/LightingConditionDisplay'
import { ReconInformation, TaskForce, TaskForceOptions } from '../../forces/TaskForce'
import { DefaultBattleCycle } from '../../gamesequence/BattleCycle'
import { logger } from '../../main'
import { PlayerContainer } from '../PlayerContainer'
import { PacificWarScenario } from '../Scenario'
import { getDieRoll, random } from '../../utils/Utility'
import { ActivationStatus, AircraftType, Side } from '../../units/Interfaces'
import { NavalUnit } from '../../units/NavalUnit'
import { Force } from '../../forces/Force'
import { Hex } from '../../map/Hex'
import { GameStatus } from '../GameStatus'
import {
  AirCombatOptions,
  AirMissionSchematic,
  AirMissionSchematicOptions,
  AirMissionType
} from '../../airmissions/AirMissionSchematic'
import { AirUnit } from '../../units/AirUnit'
import { AirStrikeTarget } from '../../airmissions/AirStrikeTarget'
import { AirCombatResult, AirNavalCombatResultsTable } from '../../displays/AirNavalCombatResultsTable'
import {
  minNumberOfAirUnitTargets,
  maxNumberOfAirUnitTargets,
  numBattleshipsPerTargetGroup,
  numShipsPerTargetGroup
} from './es1Config'
import { DetectionLevel, SearchChart, SearchOptions, TimeOfDay } from '../../displays/SearchCharts'
import { alliedSearchChartResults as alliedNavalSearchChartResults } from '../../../src/displays/AlliedSearchTables'
import { AirNavalCombatType } from '../../displays/interfaces'

// If any of the air mission phases need to be done according to Scenario rules,
// then that is done in this sub-class
export class ES1AirMissionSchematic extends AirMissionSchematic {
  private firstAttack!: boolean
  constructor(options: AirMissionSchematicOptions) {
    super(options)
  }

  public async moveMisionAirUnits() {
    GameStatus.print('\n')
    GameStatus.print('\t\t\tJapanese Carrier Air Units move from 3159 to 2860 (Oahu)')
    // no detection in any hexes along route
  }

  public async detectMisionAirUnits(hex: Hex): Promise<DetectionLevel> {
    GameStatus.print('\n')
    GameStatus.print(`\t\t\tSearch for Air in hex ${hex.HexNumber}`)
    if (GameStatus.battleCycle === 1) {
      GameStatus.print(`\t\t\t\t => First Battle Cycle, no search conducted`)
      return DetectionLevel.undetected
    } else {
      GameStatus.print(`\t\t\t\t => Second Battle Cycle, do search of incoming strike`)
      return super.detectMisionAirUnits(hex)
    }
  }

  public isCoordinated(dieRoll: number): boolean {
    const ret = super.isCoordinated(dieRoll)
    if (GameStatus.battleCycle === 1) {
      GameStatus.print('\t\t\t (redundant in Battle Cycle 1)')
    }
    return ret
  }

  public async designateStrikeTargets(): Promise<AirStrikeTarget[] | undefined> {
    GameStatus.print('\n')
    GameStatus.print('\t\t\tDesignate Targets for Japanese Air Strike')
    GameStatus.print('\t\t\t-----------------------------------------')

    const force = this.targetHex.Force
    if (!force) {
      throw Error('Oahu force not found!')
    }
    const taskForces = this.targetHex.TaskForces

    const numForces: number = force === undefined ? 0 : 1
    const plural: string = numForces === 1 ? '' : 's'
    GameStatus.print(`\t\t\tTarget Hex contains ${numForces} force${plural}, and ${taskForces.length} task forces`)
    GameStatus.print(`\t\t\t\t => Target is Force`)

    const battleshipsAtTarget = force.NavalUnits.filter((unit) => unit.Id.startsWith('BB'))
    let airStrikeTargets: AirStrikeTarget[] = []
    if (GameStatus.battleCycle === 1) {
      airStrikeTargets = this.allocateStrikeTargetsBattleCycle1(
        this.missionAirUnits,
        force.AirUnits,
        battleshipsAtTarget
      )
    } else {
      airStrikeTargets = this.allocateStrikeTargetsBattleCycle2(
        this.missionAirUnits.filter((missionAirUnits) => !missionAirUnits.Eliminated && !missionAirUnits.Aborted),
        force.AirUnits,
        force.NavalUnits
      )
    }
    return airStrikeTargets
  }

  // Air Unit targeting for first battle cycle
  // 1. This algorithm targets between 1 and 3 air units and 6 battleships per air unit (by default) (see config)
  // 2. Each Japanese air unit attacking US air units will target the one US air unit not already targeted containing the
  // most steps
  // 3. Each Japanese air unit attacking US naval units will target the same group of 6 battleships
  // 4. To prevent hits bunching on one or two ships the order of targeting amongst the six is reversed for each air unit
  // 5. We do not need to preallocate air unit targets but since the hits will be spread amongst multiple air units
  // I have done so anyway (makes little difference)
  public allocateStrikeTargetsBattleCycle1(
    missionAirUnits: AirUnit[],
    airUnitsAtTarget: AirUnit[],
    battleshipsAtTarget: NavalUnit[]
  ): AirStrikeTarget[] {
    // allocate 1, 2 or 3 units to attack US air
    // 3, 4 or 5 remaining steps attack BBs
    const numAirUnitsAttackingAir = random(minNumberOfAirUnitTargets, maxNumberOfAirUnitTargets)

    // sort air targets into order of priority based on number of steps
    airUnitsAtTarget.sort((a, b) => b.Steps - a.Steps)

    // get the first n units to be the list of units to be attacked
    const targetAirUnits = airUnitsAtTarget.slice(0, numAirUnitsAttackingAir)

    const airStrikeTargets: AirStrikeTarget[] = new Array<AirStrikeTarget>()

    // allocate Japanese air units to attack these n air units

    // First attack against ships gets the -5 DRM...this should be the strongest Japanese air
    // unit, ie one of the two 6-step air groups.
    const shokakuAirGroup = missionAirUnits.filter((unit) => unit.Id === 'CAD5')[0] // shokaku air unit reserved for first strike
    missionAirUnits = missionAirUnits.filter((unit) => unit.Id != 'CAD5')

    const airUnitsAttackingAir = missionAirUnits
      .sort(() => Math.random() - Math.random())
      .slice(0, numAirUnitsAttackingAir)

    let index = 0
    for (const unit of airUnitsAttackingAir) {
      airStrikeTargets.push(
        new AirStrikeTarget({
          attacker: unit,
          combatType: AirNavalCombatType.AirvsUnalertedAir,
          airTarget: targetAirUnits[index++]
        })
      )
    }

    const airUnitsAttackingNaval = missionAirUnits.filter((el) => !airUnitsAttackingAir.includes(el))

    if (airUnitsAttackingNaval.length > 0) {
      // insert shokakuAirUnit at front so it fires first
      airUnitsAttackingNaval.splice(0, 0, shokakuAirGroup)

      // Select 6 battleships to target then allocate attacking units amongst these
      // as per victory conditions (need to get 4 hits on 6 battleships)
      let targetBattleships = battleshipsAtTarget
        .sort(() => Math.random() - Math.random())
        .slice(0, numBattleshipsPerTargetGroup)

      // each air unit will target numBattleshipsPerTargetGroup ships
      // next air unit will target those same 6 ships but in reverse to spread hits evenly
      GameStatus.print('\n')

      GameStatus.print(`\t\t\t\t => ${airUnitsAttackingNaval.length} air units attacking 6 battleships each`)
      GameStatus.print(`\t\t\t\t => ${airUnitsAttackingAir.length} air units attacking unalerted air units`)

      const reverseArray = [...targetBattleships].reverse()

      let odd = true
      for (const unit of airUnitsAttackingNaval) {
        airStrikeTargets.push(
          new AirStrikeTarget({
            attacker: unit,
            combatType: AirNavalCombatType.FAirvsNaval,
            navalTargets: odd ? targetBattleships : reverseArray
          })
        )
        odd = !odd
      }
    }
    return airStrikeTargets
  }

  public allocateNavalTargetsForLessThan4Needed(
    missionAirUnits: AirUnit[],
    shipsAtTarget: NavalUnit[]
  ): AirStrikeTarget[] {
    console.log('Less than 4 hits needed to win - target 3 ships with hits less than 4 and 3 others at random')

    const airStrikeTargets = new Array<AirStrikeTarget>()

    // get all battleships not yet at the VP threshold for hits (4)
    // assume any ships with no hits are not part of the target list

    const targetShips = shipsAtTarget
      .filter((unit) => unit.Hits < 4 && unit.Hits > 0)
      .sort(() => Math.random() - Math.random()) // randomise priorties

    // assign 3 air units with highest AA strength - so sort and slice
    let attackingAirUnits = missionAirUnits.sort((a, b) => b.AAStrength - a.AAStrength).slice(0, 3)

    let reverseArray = [...targetShips].reverse()

    let odd = true
    for (const unit of attackingAirUnits) {
      airStrikeTargets.push(
        new AirStrikeTarget({
          attacker: unit,
          combatType: AirNavalCombatType.FAirvsNaval,
          navalTargets: odd ? targetShips : reverseArray
        })
      )
      odd = !odd
    }
    // remaining air units - assign at random
    const otherAirUnits = missionAirUnits.filter((item) => !attackingAirUnits.includes(item))

    for (const unit of otherAirUnits) {
      const otherShips = shipsAtTarget
        .filter((unit) => unit.Hits === 0)
        .sort(() => Math.random() - Math.random())
        .slice(0, numShipsPerTargetGroup) // randomise priorties
      airStrikeTargets.push(
        new AirStrikeTarget({
          attacker: unit,
          combatType: AirNavalCombatType.FAirvsNaval,
          navalTargets: odd ? otherShips : reverseArray
        })
      )
      odd = !odd
    }
    return airStrikeTargets
  }

  public allocateNavalTargetsForMoreThan4Needed(
    missionAirUnits: AirUnit[],
    shipsAtTarget: NavalUnit[]
  ): AirStrikeTarget[] {
    console.log('More  than 4 hits needed to win - target ships with hits less than 4')
    const airStrikeTargets = new Array<AirStrikeTarget>()
    6
    // get all battleships not yet at the VP threshold for hits (4)
    // assume any ships with no hits are not needed to hit the

    let targetShips = shipsAtTarget
      .filter((unit) => unit.Hits <= 5 && unit.Hits > 0)
      .sort(() => Math.random() - Math.random()) // randomise priorties

    // if there are less than 6 (or numBattleshipsPerTargetGroup) ships in this list then pick enough random battleships
    // to bring the number up to 6 (otherwise it will be impossible to win)

    if (targetShips.length < numBattleshipsPerTargetGroup) {
      const battleshipsToAdd = numBattleshipsPerTargetGroup - targetShips.length
      const remainingBattleships = shipsAtTarget
        .filter((unit) => unit.Id.startsWith('BB') && unit.Hits === 0)
        .sort(() => Math.random() - Math.random())
        .slice(0, battleshipsToAdd)
      targetShips = targetShips.concat(remainingBattleships)
    }

    const reverseArray = [...targetShips].reverse()

    let odd = true
    for (const unit of missionAirUnits) {
      airStrikeTargets.push(
        new AirStrikeTarget({
          attacker: unit,
          combatType: AirNavalCombatType.FAirvsNaval,
          navalTargets: odd ? targetShips : reverseArray
        })
      )
      odd = !odd
    }
    return airStrikeTargets
  }
  public allocateNavalTargetsIfEnoughHitsForVictory(
    missionAirUnits: AirUnit[],
    shipsAtTarget: NavalUnit[]
  ): AirStrikeTarget[] {
    GameStatus.print(
      '\t\t\t\t6 battleships with 4 or more - enough to win - allocate random ship targets amongst non crippled or sunk remaining ships'
    )

    GameStatus.print('\n')
    GameStatus.print(`\t\t\t\t => ${missionAirUnits.length} air units attacking ${numShipsPerTargetGroup} ships each`)
    const airStrikeTargets = new Array<AirStrikeTarget>()

    const possibleTargets = shipsAtTarget.filter((unit) => !(unit.Hits >= 4))

    for (const unit of missionAirUnits) {
      let targetShips = possibleTargets.sort(() => Math.random() - Math.random()).slice(0, numShipsPerTargetGroup)

      airStrikeTargets.push(
        new AirStrikeTarget({
          attacker: unit,
          combatType: AirNavalCombatType.FAirvsNaval,
          navalTargets: targetShips
        })
      )
    }
    console.log('NUM TARGETS = ', airStrikeTargets.length)
    return airStrikeTargets
  }

  public determineTargetTypeAllocations(
    missionAirUnits: AirUnit[],
    percentage?: number
  ): {
    numAirUnitsAttackingNaval: number
    numAirUnitsAttackingAir: number
  } {
    const navalHitsNeeded = 24 - GameStatus.navalUnitHits
    const airHitsNeeded = 12 - GameStatus.airUnitHits

    let navalPercentage = navalHitsNeeded / (navalHitsNeeded + airHitsNeeded)
    if (navalHitsNeeded + airHitsNeeded === 0) {
      // already won - allocate targets at random
      navalPercentage = percentage ?? random(0, 100)
    }
    // since naval combat hits less that strafe hits round up number attacking naval
    const numAirUnitsAttackingNaval = Math.ceil(navalPercentage * missionAirUnits.length)
    const numAirUnitsAttackingAir = missionAirUnits.length - numAirUnitsAttackingNaval

    return { numAirUnitsAttackingNaval, numAirUnitsAttackingAir }
  }

  public allocateStrikeTargetsBattleCycle2(
    missionAirUnits: AirUnit[],
    airUnitsAtTarget: AirUnit[],
    shipsAtTarget: NavalUnit[]
  ): AirStrikeTarget[] {
    missionAirUnits = missionAirUnits.filter((unit) => !unit.Aborted)
    let airStrikeTargets = new Array<AirStrikeTarget>()

    if (this.Detected) {
      // No attacks on air units (they are alerted)
      // alogorithm for allocating targets:
      // 2. If 24 battleship hits achieved across 6 battleships, allocate random ship targets
      // 3. If less than 24 victory points achieved allocate all air units to attack ships:
      //    if <= 4 hits required 3 attacking units against the ships with < 4 hits other 3 attack random targets
      //    if 5+ hits required, allocate all attacking units to those ships
      GameStatus.print('\n')

      if (ES1.battleshipsWith4HitsOrMore.length >= 6) {
        airStrikeTargets = this.allocateNavalTargetsIfEnoughHitsForVictory(missionAirUnits, shipsAtTarget)
      } else if (GameStatus.navalUnitHits >= 20) {
        // 4 or less hits needed
        airStrikeTargets = this.allocateNavalTargetsForLessThan4Needed(missionAirUnits, shipsAtTarget)
      } else {
        // 5+ hits required - all air units attack the battleships needed to VP win
        airStrikeTargets = this.allocateNavalTargetsForMoreThan4Needed(missionAirUnits, shipsAtTarget)
      }
      GameStatus.print(`\t\t\t\t => Target Ships: `)
      for (const target of airStrikeTargets) {
        GameStatus.print(`\n\t\t\t\t\t ${target.Attacker.Id} attacking: `)
        for (const unit of target.NavalTargets) GameStatus.print(`\t\t\t\t\t ${unit.Id} ${unit.Name} `)
      }
    } else {
      console.log('>>>> NOT DETECTED')
      // we can strafe here so airUnitsAtTarget will be used

      const { numAirUnitsAttackingNaval, numAirUnitsAttackingAir } =
        this.determineTargetTypeAllocations(missionAirUnits)

      // allocate units at random (we could allocate by anti-naval strength but that seems like overkill)
      const airUnitsAttackingNaval = missionAirUnits
        .sort(() => Math.random() - Math.random())
        .slice(0, numAirUnitsAttackingNaval)

      // allocate naval targets
      if (ES1.battleshipsWith4HitsOrMore.length >= 6 && airUnitsAttackingNaval.length > 0) {
        airStrikeTargets = this.allocateNavalTargetsIfEnoughHitsForVictory(airUnitsAttackingNaval, shipsAtTarget)
      } else if (GameStatus.navalUnitHits >= 20 && airUnitsAttackingNaval.length > 0) {
        // 4 or less hits needed
        airStrikeTargets = this.allocateNavalTargetsForLessThan4Needed(airUnitsAttackingNaval, shipsAtTarget)
      } else {
        // 5+ hits required - all air units attack the battleships needed to VP win
        airStrikeTargets = this.allocateNavalTargetsForMoreThan4Needed(airUnitsAttackingNaval, shipsAtTarget)
      }

      // allocate air targets for strafing
      // sort air targets into order of priority based on number of steps
      airUnitsAtTarget.sort((a, b) => b.Steps - a.Steps)

      // get the first n units to be the list of units to be attacked
      const targetAirUnits = airUnitsAtTarget.slice(0, numAirUnitsAttackingAir)

      const airUnitsAttackingAir = missionAirUnits.filter((unit) => !airUnitsAttackingNaval.includes(unit))

      // todo total up anti-air strength of all units and do one die roll 
      // then allocate hits
      
      let index = 0
      for (const unit of airUnitsAttackingAir) {
        airStrikeTargets.push(
          new AirStrikeTarget({
            attacker: unit,
            combatType: AirNavalCombatType.AirvsUnalertedAir,
            airTarget: targetAirUnits[index++]
          })
        )
      }
    }
    return airStrikeTargets
  }
  public async flakProcedure(options: AirCombatOptions, dieRoll?: number): Promise<void> {
    if (GameStatus.battleCycle === 1) {
      GameStatus.print(`\t\t\tResolve FLAK`)
      GameStatus.print('\t\t\t------------')
      GameStatus.print(`\t\t\t\t => No FLAK on battle cycle 1`) // Herman clarification, this differs from Strategic Scenario
      return undefined
    } else {
      return super.flakProcedure(options)
    }
  }

  private statusStr(unit: AirUnit): string {
    return this.detected && unit.Eliminated ? ' (ELIMINATED) ' : this.detected && unit.Aborted ? '(ABORTED) ' : ''
  }

  public allocateFlakHits(hits: number, options: AirCombatOptions) {
    if (hits === 0) {
      GameStatus.print(`\t\t\t\t => No hits to allocate`)
      return
    }
    let hitsStillToAllocate = hits

    // remove any eliminated or aborted units from the attackers
    let otherUnits = options.attackingUnits.filter((unit) => unit.Eliminated === false && unit.Aborted === false)

    // if any unit has one hit from CAP make that the first unit to take a (single) hit
    const firstTarget = otherUnits.find((unit) => unit.HitsThisMission === 1)
    if (firstTarget) {
      firstTarget.Hits += 1
      firstTarget.HitsThisMission += 1
      firstTarget.Aborted = true
      hitsStillToAllocate -= 1

      GameStatus.print(
        `\t\t\t\tAllocating 1 hit to ${firstTarget.Id} -> now has ${firstTarget.Hits} hits ${this.statusStr(
          firstTarget
        )}`
      )
    }

    otherUnits = otherUnits.filter((unit) => unit.Id !== firstTarget?.Id)

    // allocate remaining hits, two per unit, prioritising as follows:
    // if the target contains a Force, use anti-air; if the target contains one or more Task Forces, use
    // anti-naval

    let units = this.prioritiseRemainingTargets(options)

    while (hitsStillToAllocate > 0 && units.length > 0) {
      const thisUnit = units[0]
      const hitsOnThisUnit = Math.min(hitsStillToAllocate, thisUnit.Steps, 2)
      hitsStillToAllocate -= hitsOnThisUnit
      thisUnit.Hits += hitsOnThisUnit
      thisUnit.HitsThisMission += hitsOnThisUnit

      if (hitsOnThisUnit === 2 || thisUnit.Eliminated) {
        thisUnit.Aborted = true
        units = units.filter((unit) => unit.Id !== thisUnit.Id)
      }
      GameStatus.print(
        `\t\t\t\tAllocating ${hitsOnThisUnit} hits to ${thisUnit.Id} -> now has ${thisUnit.Hits} hits ${this.statusStr(
          thisUnit
        )}`
      )

      // if all units have recevied two hits, units array will now be empty
      // so reset it back to all (uneliminated) units and start again 2 hits per unit
      if (hitsStillToAllocate > 0 && units.length === 0) {
        units = options.attackingUnits.filter((unit) => !unit.Eliminated)
      }
    }
  }

  private prioritiseRemainingTargets(options: AirCombatOptions): AirUnit[] {
    let units = options.attackingUnits.sort((a, b) => b.AAStrength - a.AAStrength)
    const targetContainsTaskForces = this.targetHex.TaskForces
    if (targetContainsTaskForces.length > 0) {
      units = options.attackingUnits.sort((a, b) => b.AntiNavalStrength - a.AntiNavalStrength)
    }
    return units
  }
  public allocateAirCombatHits(result: { hitsvsEscort: number; hitsvsCap: number }, options: AirCombatOptions) {
    // first hit goes to CAP or escort unit, then any excess hits are
    // allocated by attacker.

    // We are going to allocate to hits per unit, beginning with the CAP or Escort unit
    // 1. Mission Air Units: if CAP unit eliminated, allocate hits (2 at a time to cause abort) to others

    // CAP vs Escort
    if (options.escortUnit) {
      // allocate first hit to escort unit up to remaining hits/steps in the unit

      let maximumRemainingHitsForEscort = options.escortUnit.Steps

      // the number of hits to apply to the escort unit is the hit result up to a max of 2.
      // But reduced if the escort unit has less than 2 steps left

      if (result.hitsvsEscort < 2) {
        maximumRemainingHitsForEscort = Math.min(result.hitsvsEscort, options.escortUnit.Steps)
      }

      // allocate max of 2 hits to escort
      const hitsApplytoEscort = Math.min(2, maximumRemainingHitsForEscort)

      // set the hits for the escort unit
      options.escortUnit.Hits += hitsApplytoEscort
      options.escortUnit.HitsThisMission += hitsApplytoEscort

      // reducde hits still left to allocate amongst other units
      let hitsStillToAllocate = result.hitsvsEscort - hitsApplytoEscort

      let otherUnits: AirUnit[] = options.attackingUnits
      if (hitsApplytoEscort == 2) {
        options.escortUnit.Aborted = true
        otherUnits = options.attackingUnits.filter((unit) => unit.Id !== options.escortUnit?.Id)
      }

      GameStatus.print(
        `\n\t\t\tApply ${hitsApplytoEscort} Hits to Escort Unit ${options.escortUnit.Id} -> now has ${
          options.escortUnit.Steps
        } steps${this.statusStr(options.escortUnit)}`
      )

      // sort mission air units by AA strength and allocate two hits per unit beginning with escort unit then by strongest)
      // until no more hits to allocate
      let units = otherUnits.sort((a, b) => b.AAStrength - a.AAStrength)

      while (hitsStillToAllocate > 0 && units.length > 0) {
        const nextUnit = units[0]
        const hitsOnThisUnit = Math.min(hitsStillToAllocate, units[0].Steps, 2)
        hitsStillToAllocate -= hitsOnThisUnit
        units[0].Hits += hitsOnThisUnit
        units[0].HitsThisMission += hitsOnThisUnit

        if (hitsOnThisUnit === 2 || units[0].Eliminated) {
          units[0].Aborted = true
          units = units.filter((unit) => unit.Id !== units[0].Id)
        }
        if (hitsOnThisUnit) {
          const statusStr = nextUnit.Eliminated ? ' (ELIMINATED) ' : nextUnit.Aborted ? ' (ABORTED) ' : ''
          GameStatus.print(
            `\t\t\tApply ${hitsOnThisUnit} Hits to Attacking Air Unit ${nextUnit.Id} -> now has ${nextUnit.Steps} steps${statusStr}`
          )
        }

        // if all units have recevied two hits, units array will now be empty
        // so reset it back to all (uneliminated) units and start again 2 hits per unit

        if (hitsStillToAllocate > 0 && units.length === 0) {
          units = []
          if (options.escortUnit.Eliminated === false) {
            units.push(options.escortUnit)
          }
          units = units.concat(
            options.attackingUnits
              .filter((unit) => !unit.Eliminated && unit.Id !== options.escortUnit?.Id)
              .sort((a, b) => b.AAStrength - a.AAStrength)
          )
        }
      }
      if (hitsStillToAllocate > 0) {
        GameStatus.print(`\t\t\tApply ${hitsStillToAllocate} Hits Lost`)
      }
    }

    // Escort vs CAP
    if (options.capUnit) {
      // allocate first hit to CAP unit up to remaining hits/steps in the unit

      let maximumRemainingHitsForCap = options.capUnit.Steps

      // the number of hits to apply to the CAP unit is the hit result up to a max of 2.
      // But reduced if the CAP unit has less than 2 steps left
      GameStatus.print(`\n\t\t\tCAP Unit ${options.capUnit.Id} starts with ${options.capUnit.Steps} steps`)
      if (result.hitsvsCap < 2) {
        maximumRemainingHitsForCap = Math.min(result.hitsvsCap, options.capUnit.Steps)
      }

      // allocate max of 2 hits to escort
      const hitsApplytoCap = Math.min(2, maximumRemainingHitsForCap)
      GameStatus.airStepsEliminated += hitsApplytoCap

      // set the hits for the escort unit
      options.capUnit.Hits += hitsApplytoCap

      // reduce hits still left to allocate amongst other units
      let hitsStillToAllocate = result.hitsvsCap - hitsApplytoCap

      let otherUnits: AirUnit[] = options.defendingUnits
      if (hitsApplytoCap == 2) {
        options.capUnit.Aborted = true
        otherUnits = options.defendingUnits.filter((unit) => unit.Id !== options.capUnit?.Id)
      }

      const statusStr = options.capUnit.Eliminated ? ' (ELIMINATED) ' : ''
      GameStatus.print(
        `\t\t\tApply ${hitsApplytoCap} Hits to CAP Unit ${options.capUnit.Id} -> now has ${options.capUnit.Steps} steps${statusStr}`
      )

      // sort mission air units by AA strength and allocate two hits per unit beginning with escort unit then by strongest)
      // until no more hits to allocate
      otherUnits = otherUnits.sort((a, b) => b.AAStrength - a.AAStrength)
      while (hitsStillToAllocate > 0 && otherUnits.length > 0) {
        const hitsOnThisUnit = Math.min(hitsStillToAllocate, Math.min(otherUnits[0].Steps, 2))
        hitsStillToAllocate -= hitsOnThisUnit
        const nextUnit = otherUnits[0]

        nextUnit.Hits += hitsOnThisUnit
        GameStatus.airStepsEliminated += hitsOnThisUnit
        if (hitsOnThisUnit === 2 || nextUnit.Eliminated) {
          otherUnits = otherUnits.filter((unit) => unit.Id !== nextUnit.Id)
        }
        if (hitsOnThisUnit > 0) {
          const statusStr = nextUnit.Eliminated ? ' (ELIMINATED) ' : ''
          GameStatus.print(
            `\t\t\tApply ${hitsOnThisUnit} Hits to Defending Air Unit ${nextUnit.Id} -> now has ${nextUnit.Steps} steps${statusStr}`
          )
        }

        // if all units have recevied two hits, units array will now be empty
        // so reset it back to all (uneliminated) units and start again 2 hits per unit
        // if (hitsStillToAllocate > 0 && otherUnits.length === 0) {
        //   otherUnits = options.defendingUnits.filter((unit) => !unit.Eliminated)
        // }

        if (hitsStillToAllocate > 0 && otherUnits.length === 0) {
          otherUnits = []
          if (options.capUnit.Eliminated === false) {
            otherUnits.push(options.capUnit)
          }
          otherUnits = otherUnits.concat(
            options.defendingUnits
              .filter((unit) => !unit.Eliminated && unit.Id !== options.capUnit?.Id)
              .sort((a, b) => b.AAStrength - a.AAStrength)
          )
        }
      }
    }
  }
  public strikeStrafeProcedure(airStrikeTargets: AirStrikeTarget[]) {
    GameStatus.print('\n')
    GameStatus.print(`\t\t\tResolve Air Strikes`)
    GameStatus.print('\t\t\t-------------------')
    GameStatus.print('\n')
    // we do naval attacks first so that the -5 modifier will count, which maximises the chances
    // of a critical hit (critical hits do not apply to air units)

    const airUnitTargets = airStrikeTargets.filter(
      (target) => target.AirNavalCombatType === AirNavalCombatType.AirvsUnalertedAir
    )
    const navalUnitTargets = airStrikeTargets.filter(
      (target) => target.AirNavalCombatType === AirNavalCombatType.FAirvsNaval
    )

    // 1. Resolve all air attacks against naval units
    this.firstAttack = GameStatus.battleCycle === 1

    for (const airStrike of navalUnitTargets) {
      if (airStrike.AirNavalCombatType === AirNavalCombatType.FAirvsNaval) {
        let unmodifiedDieRoll = getDieRoll()
        this.resolveAirStrikesvsNaval(airStrike, unmodifiedDieRoll)
      }
    }

    this.firstAttack = false

    // 2. Resolve all air attacks against [unalerted] air units
    for (const airStrike of airUnitTargets) {
      let dieRoll = getDieRoll()
      GameStatus.print(
        `\t\t\tAttacker is ${airStrike.Attacker.print()} - attack vs. ${airStrike.AirTarget.print()} using row ${
          airStrike.AirNavalCombatType
        }`
      )
      this.resolveStrafevsUnalertedAir(airStrike, dieRoll)
    }
  }

  public set FirstAttack(first: boolean) {
    this.firstAttack = first
  }

  public resolveAirStrikesvsNaval(airStrike: AirStrikeTarget, unmodifiedDieRoll: number, secondRoll?: number) {
    GameStatus.print(`\t\t\tAir Unit ${airStrike.Attacker.print()} attacking (in order of priority):`)
    let priority = 1
    for (const ship of airStrike.NavalTargets) {
      GameStatus.print(`\t\t\t\t${priority++} ${ship.print()}`)
    }
    let modifiedDieRoll = unmodifiedDieRoll
    let modifierStr = ''

    // Herman ruling: first attack DRM applies to attacks against air units as well as naval units
    if (this.firstAttack) {
      modifiedDieRoll = Math.max(0, unmodifiedDieRoll - 5)
      modifierStr = ` (-5 for first attack) = ${modifiedDieRoll}`
    } else {
      modifiedDieRoll = unmodifiedDieRoll
    }
    this.firstAttack = false
    GameStatus.print(`\t\t\t\t\t=> using row ${airStrike.AirNavalCombatType}`)

    GameStatus.print(`\t\t\t\t\t=> Die Roll is ${unmodifiedDieRoll}${modifierStr}`)

    const attackerModifiedStrength = airStrike.Attacker.AntiNavalStrength
    GameStatus.print(`\t\t\t\t\t=> Attacker Anti-Naval Strength is ${attackerModifiedStrength}`)
    let result = AirNavalCombatResultsTable.getHitsFor(
      attackerModifiedStrength,
      modifiedDieRoll,
      AirNavalCombatType.FAirvsNaval
    )
    if (result.hits === undefined) {
      throw Error(`No result from Air-Naval Combat Results Table`)
    }
    GameStatus.print(`\t\t\t\t\t=> Number of Hits = ${result.hits}`)
    let hits = result.hits
    if (modifiedDieRoll == 0) {
      let secondDieRoll = secondRoll ? secondRoll : getDieRoll()
      const criticalHitsDieRoll = AirNavalCombatResultsTable.getCriticalHits(secondDieRoll)
      hits += criticalHitsDieRoll
      GameStatus.print(
        `\t\t\t\t\t=> Critical Hit Die Roll = ${secondDieRoll}, Number Extra Hits = ${criticalHitsDieRoll}`
      )
      GameStatus.print(`\t\t\t\t\t=> Total Number of Hits = ${hits}`)
    }
    if (GameStatus.battleCycle === 1) {
      hits *= 2
      GameStatus.print(`\t\t\t\t\t=> First Battle Cycle hits doubled, Final Num Hits = ${hits}`)
    }
    GameStatus.print(`\n`)
    this.distributeHits(airStrike.NavalTargets, hits)
    GameStatus.print(`\n`)
  }

  public resolveStrafevsUnalertedAir(airStrike: AirStrikeTarget, unmodifiedDieRoll: number) {
    let modifiedDieRoll = unmodifiedDieRoll
    let modifierStr = ''

    // Herman ruling: first attack DRM applies to attacks against air units as well as naval units
    if (this.firstAttack) {
      modifiedDieRoll = Math.max(0, unmodifiedDieRoll - 5)
      modifierStr = ` (-5 for first attack) = ${modifiedDieRoll}`
    } else {
      modifiedDieRoll = unmodifiedDieRoll
    }
    this.firstAttack = false
    GameStatus.print(`\t\t\t\t=> using row ${airStrike.AirNavalCombatType}`)

    GameStatus.print(`\t\t\t\t=> Die Roll is ${unmodifiedDieRoll}${modifierStr}`)

    const attackerModifiedStrength = airStrike.Attacker.AAStrength - airStrike.Attacker.Hits
    GameStatus.print(`\t\t\t\t=> Attacker Anti-Air Strength is ${attackerModifiedStrength}`)

    let result = AirNavalCombatResultsTable.getHitsFor(
      attackerModifiedStrength,
      modifiedDieRoll,
      AirNavalCombatType.AirvsUnalertedAir
    )

    if (result.hits === undefined) {
      logger.debug(`Strafe attack result = ${result}`)
      throw Error(`No result from Air-Naval Combat Results Table`)
    }
    GameStatus.print(`\t\t\t\t=> Number of Hits = ${result.hits}`)
    let hits = result.hits

    // NOTE: no critical hits for attack vs air units

    if (GameStatus.battleCycle === 1) {
      hits *= 2
      GameStatus.print(`\t\t\t\t=> First Battle Cycle hits doubled, Final Num Hits = ${hits}`)
    }
    const stepsAtStart = airStrike.AirTarget.Steps
    airStrike.AirTarget.Hits += hits // reduce the air unit's steps by hits (min 0)

    const pluralStr = airStrike.AirTarget.Steps === 1 ? '' : 's'

    GameStatus.print(`\t\t\t\t\t=> ${airStrike.AirTarget.Id} now has ${airStrike.AirTarget.Steps} step${pluralStr}`)
    if (airStrike.AirTarget.Eliminated) {
      GameStatus.print(`\t\t\t\t\t\t=> Air Unit ELIMINATED!`)
    }
    GameStatus.print(`\n`)
    GameStatus.airStepsEliminated += Math.min(stepsAtStart, hits) // excess hits over air unit steps are lost
  }
}

// override default battle cycle rules with scenario specific rules here
class ES1BattleCyle extends DefaultBattleCycle {
  private scenario: ES1

  constructor(scenario: ES1) {
    super()
    this.scenario = scenario
  }

  public endOfCycle() {
    GameStatus.print(`\n`)
    GameStatus.print('\t\t\tGAME STATUS')
    GameStatus.print('\t\t\t=========================')

    let shipStr = ''
    if (ES1.battleshipsWith4HitsOrMore.length === 0) {
      shipStr += '(NONE)'
    }
    for (const ship of ES1.battleshipsWith4HitsOrMore) {
      let hitStr = `${ship.Hits} hits`
      if (ship.Sunk === true) {
        hitStr = 'SUNK'
      } else if (ship.Crippled === true) {
        hitStr = 'CRIPPLED'
      }
      shipStr += `\n\t\t\t\t\t => ${ship.print()} (${hitStr})`
    }
    GameStatus.print(`\t\t\t\tBattleships with 4 or more hits: ${shipStr}`)
    GameStatus.print(`\t\t\t\tAir Steps Eliminated: ${GameStatus.airStepsEliminated}`)

    GameStatus.print(
      '-------------------------------------------------------------------------------------------------'
    )
  }
  public async lightingPhase() {
    if (GameStatus.battleCycle === 1) {
      LightingConditionDisplay.LightingCondition = LightingCondition.Day_AM
    } else {
      LightingConditionDisplay.LightingCondition = LightingCondition.Day_PM
    }
    GameStatus.print('\t\t\tLIGHTING PHASE')
    GameStatus.print('\t\t\t=========================')
    GameStatus.print(`\t\t\t\t=> Set Lighting To ${LightingConditionDisplay.LightingCondition}`)
    GameStatus.print(
      '-------------------------------------------------------------------------------------------------'
    )
    await GameStatus.pause(2500)
  }

  public async advantageDeterminationPhase() {
    GameStatus.print('\t\t\tADVANTAGE DETERMINATION PHASE')
    GameStatus.print('\t\t\t===================================')
    GameStatus.print('\t\t\t\t=> Set Advantage To Japan')
    GameStatus.print(
      '-------------------------------------------------------------------------------------------------'
    )
    GameStatus.advantage = Side.Japan
    await GameStatus.pause(2500)
  }

  public async advantageMovementPhase() {
    GameStatus.print('\t\t\tADVANTAGE MOVEMENT PHASE')
    GameStatus.print('\t\t\t===================================')
    GameStatus.print('\t\t\t\t=> No Naval movement. Japanese TFs remain at hex 3519')
    GameStatus.advantage = Side.Japan

    if (GameStatus.battleCycle === 1) {
      GameStatus.print('\t\t\t\t=> No US searches in BC1')

      return
    }
    GameStatus.print('\t\t\t\t=> US conducts search for TFs in hex 3591 with LRA unit')

    // note second battle cycle -> US can do a search here even if Japanese TFs do not move

    // US search for Japan TFs
    // Use LRA

    // -1 DRM because two TFs in hex...TODO check the hex and work this out

    // for now just pass in the -1 as the DRM

    const dieRoll = getDieRoll()
    let options: SearchOptions = {
      navalSearchTable: alliedNavalSearchChartResults, // could be allied or japanese table (they differ)
      range: 3,
      dieRoll,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Day,
      DRM: -1
    }

    let result: DetectionLevel = SearchChart.searchForNaval(options)
    GameStatus.print(`\t\t\t\t=> Search Die Roll = ${dieRoll}, result = ${result}`)

    const detected: boolean = result != DetectionLevel.undetected
    GameStatus.print(`\t\t\t\t=> Detected = ${detected}`)

    if (detected) {
      // print the correct detection information for the given detection level
      const hex = this.scenario.JapaneseTaskForceHex

      for (const taskForce of hex.TaskForces) {
        if (result === DetectionLevel.detectedRed) {
          taskForce.printRedReconInfo('' + taskForce.TaskForceId)
        } else if (result === DetectionLevel.detectedGreen) {
          taskForce.printGreenReconInfo('' + taskForce.TaskForceId)
        } else if (result === DetectionLevel.detectedBlue) {
          taskForce.printBlueReconInfo('' + taskForce.TaskForceId)
        }
      }

      hex.Detected = true
    }

    GameStatus.print('\n')

    await GameStatus.pause(2500)
  }

  public async advantageAirMissionPhase() {
    GameStatus.print('\t\t\tADVANTAGE AIR MISSION PHASE')
    GameStatus.print('\t\t\t===================================')
    GameStatus.print(
      '-------------------------------------------------------------------------------------------------'
    )

    // decide target hex, origin hex, mission type and air units

    let missionAirUnits: AirUnit[]

    // get all air units from the two Japanese task forces
    missionAirUnits = this.scenario.TaskForces[0].AirUnits
    missionAirUnits = missionAirUnits.concat(this.scenario.TaskForces[1].AirUnits)

    GameStatus.print('\t\t\t\tMission Air Units')
    GameStatus.print('\t\t\t\t-----------------')
    for (const airUnit of missionAirUnits) {
      GameStatus.print('\t\t\t\t', airUnit.print())
    }
    await GameStatus.pause(2500)

    const targetHex = this.scenario.Force.Location

    const airMissionOptions: AirMissionSchematicOptions = {
      airMissionType: AirMissionType.AirStrike,
      missionAirUnits: missionAirUnits,
      startHex: new Hex(3159),
      targetHex: targetHex
    }
    const airMission = new ES1AirMissionSchematic(airMissionOptions)

    if (GameStatus.battleCycle === 2) {
      // do search of incoming strike to see if US units are alerted
    }
    await airMission.doAirMission()

    // Update game status
    ES1.battleshipsWith4HitsOrMore = this.scenario.Force.NavalUnits.filter(
      (unit) => unit.Id.startsWith('BB') && unit.Hits >= 4
    )
    GameStatus.navalUnitHits = this.scenario.Force.NavalUnits.reduce((accum, item) => accum + item.Hits, 0)
  }
  public async disAdvantageMovementPhase() {
    GameStatus.print('\n\t\t\tDISADVANTAGE MOVEMENT PHASE')
    GameStatus.print('\t\t\t===================================')
    GameStatus.print('\t\t\t\t=> No Movement.')
    GameStatus.print(
      '-------------------------------------------------------------------------------------------------'
    )
  }

  public async disAdvantageAirMissionPhase() {
    GameStatus.print('\t\t\tDISADVANTAGE AIR MISSION PHASE')
    GameStatus.print('\t\t\t===================================')
    GameStatus.print('\t\t\t\t=> No Air Missions.')
    GameStatus.print(
      '-------------------------------------------------------------------------------------------------'
    )
  }
}

export class ES1 extends PacificWarScenario {
  private taskForces = new Array<TaskForce>()
  private force!: Force
  private oahuHex: Hex = new Hex(2860)
  private japaneseTFHex = new Hex(3159)
  public static battleshipsWith4HitsOrMore = new Array<NavalUnit>()

  constructor() {
    super({
      name: 'Engagement Scenario 1 Pearl Harbor',
      number: 1,
      csvFile: 'es1.csv',
      numberBattleCycles: 2
    })
    this.battleCycle = new ES1BattleCyle(this)

    // in this scenario, it is hard-wired to be DAY AM in first battle cycle, DAY_PM second battle cycle
    this.battleCycle.LightingCondition = LightingCondition.Day_AM
  }

  private async createAlliedForce(alliedPlayer: PlayerContainer) {
    // just add all units to the force including the Base marker and set the hex (location)
    this.oahuHex = new Hex(2860)

    const forceOptions = {
      side: Side.Allied,
      forceId: 1,
      units: [],
      location: this.oahuHex
    }

    this.force = new Force(forceOptions)

    this.oahuHex.addForceToHex(this.force)

    for (const unit of alliedPlayer.Units) {
      // add all units to the same force
      this.force.addUnitToForce(unit)
    }

    GameStatus.print('\n')
    this.force.print()
    GameStatus.print('\n')
    await GameStatus.pause(2500)
  }

  public get TaskForces(): TaskForce[] {
    return this.taskForces
  }

  public get Force(): Force {
    return this.force
  }

  public get JapaneseTaskForceHex(): Hex {
    return this.japaneseTFHex
  }

  private async createJapaneseTaskForces(japanesePlayer: PlayerContainer) {
    // creation of two Japanese Task Forces is random subject to the TF rules
    const taskForceOptions: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [],
      screen: []
    }
    const tf1 = new TaskForce(taskForceOptions)
    this.japaneseTFHex.addTaskForceToHex(tf1)
    this.taskForces.push(tf1)

    taskForceOptions.taskForceId = 2
    const tf2 = new TaskForce(taskForceOptions)
    this.japaneseTFHex.addTaskForceToHex(tf2)
    this.taskForces.push(tf2)

    // get a random number (0 or 1) for the task force
    for (const unit of japanesePlayer.Units) {
      unit.ActivationStatus = ActivationStatus.Activated
      // if the ship is a CV add to core else add to screen
      const tf = random(0, 1)

      if (unit.Id.startsWith('CV')) {
        logger.debug(`Adding ${unit.Id}-${unit.Name} to task force ${tf + 1} (CORE)`)
        this.taskForces[tf].addUnitToCore(unit as NavalUnit)
      } else if (unit.isNavalUnit()) {
        logger.debug(`Adding ${unit.Id}-${unit.Name} to task force ${tf + 1} (SCREEN)`)
        try {
          this.taskForces[tf].addUnitToScreen(unit as NavalUnit)
        } catch (Error) {
          // tried to add to screen of one task force - add to other Instead
          logger.debug(
            `Error adding ${unit.Id} to task force ${tf + 1} -> add to task force ${((tf + 1) % 2) + 1} instead`
          )
          try {
            this.taskForces[(tf + 1) % 2].addUnitToScreen(unit as NavalUnit)
          } catch (Error) {
            // possible that we try to add capital ship to tf with 6 - add to core
            if (unit.Id.startsWith('BB')) {
              try {
                this.taskForces[tf].addUnitToCore(unit as NavalUnit)
              } catch (Error) {
                // possible that we try to add capital ship to tf with 6 - add to core of other task force
                this.taskForces[(tf + 1) % 2].addUnitToCore(unit as NavalUnit)
              }
            } else {
              logger.error(`Cannot add ${unit.Id} to task force ${tf + 1}`)
            }
          }
        }
      }
    }
    GameStatus.print('\n')
    for (const tf of this.taskForces) {
      tf.print()
      GameStatus.print('\n')
    }
    await GameStatus.pause(2500)
  }

  public async setUpScenario(japanesePlayer: PlayerContainer, alliedPlayer: PlayerContainer): Promise<void> {
    GameStatus.print('Scenario Set Up -> Create Japanese Task Forces')
    await this.createJapaneseTaskForces(japanesePlayer)

    GameStatus.print('Scenario Set Up -> Create Allied Force')
    await this.createAlliedForce(alliedPlayer)
    await GameStatus.pause(2500)
  }

  public get BattleCycle(): DefaultBattleCycle {
    return this.battleCycle
  }
}
