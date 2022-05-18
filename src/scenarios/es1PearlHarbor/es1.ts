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
import { AirNavalCombatResultsTable } from '../../displays/AirNavalCombatResultsTable'
import { minNumberOfAirUnitTargets, maxNumberOfAirUnitTargets, numBattleshipsPerTargetGroup } from './es1Config'
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

  public async designateStrikeTargets(): Promise<AirStrikeTarget[]> {
    if (GameStatus.battleCycle === 2) {
      return []
    }
    this.detectMisionAirUnits(this.targetHex)

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
    const airStrikeTargets: AirStrikeTarget[] = this.allocateStrikeTargets(
      this.missionAirUnits,
      force.AirUnits,
      battleshipsAtTarget
    )

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
  public allocateStrikeTargets(
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
    return airStrikeTargets
  }

  public async flakProcedure() {
    if (GameStatus.battleCycle === 1) {
      GameStatus.print(`\t\t\tResolve FLAK`)
      GameStatus.print('\t\t\t------------')
      GameStatus.print(`\t\t\t\t => No FLAK on battle cycle 1`) // Herman clarification, this differs from Strategic Scenario
      GameStatus.print('\n')
    }
  }

  public allocateAirCombatHits(result: { hitsvsEscort: number; hitsvsCap: number }, options: AirCombatOptions) {
    // all hits go to CAP or escort unit, then any excess hits are
    // 1. Mission Air Units: if CAP unit eliminated, allocate hits (2 at a time to cause abort) to others

    if (options.escortUnit) {
      // allocate all hits to escort unit up to remaining hits/steps in the unit
      let hitsStillToAllocate = result.hitsvsEscort - options.escortUnit.Steps
      options.escortUnit.Hits = Math.min(6, options.escortUnit?.Hits + result.hitsvsEscort)
      if (result.hitsvsEscort >= 2) {
        options.escortUnit.Aborted = true
      }
      // escort unit eliminated...distribute remaining hits amongst mission air units
      // sort mission air units by AA strength and allocate two hits per unit 9beginning with strongest)
      // until no more hits to allocate
      const otherUnits = options.attackingUnits.filter((unit) => unit.Id !== options.escortUnit?.Id)
      let units = otherUnits.sort((a, b) => b.AAStrength - a.AAStrength)

      while (hitsStillToAllocate > 0 && units.length > 0) {
        const hitsOnThisUnit = Math.min(hitsStillToAllocate, Math.min(units[0].Steps, 2))
        hitsStillToAllocate -= hitsOnThisUnit
        units[0].Hits += hitsOnThisUnit
        console.log(`Unit Id ${units[0].Id} now has ${units[0].Steps} steps`)

        if (hitsOnThisUnit === 2) {
          units[0].Aborted = true
          units = units.filter((unit) => unit.Id !== units[0].Id)
        }
      }

      GameStatus.print(`\t\t\tEscort Unit Id ${options.escortUnit.Id} now has ${options.escortUnit.Steps} steps`)
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
    GameStatus.print('\t\t\t\t=> US conducts search for TFs in hex 3591 with LRA unit')
    GameStatus.advantage = Side.Japan

    if (GameStatus.battleCycle === 1) {
      return
    }
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
    GameStatus.print('\t\t\tDISADVANTAGE MOVEMENT PHASE')
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
