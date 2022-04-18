import { LightingCondition } from '../../displays/LightingConditionDisplay'
import { TaskForce, TaskForceOptions } from '../../forces/TaskForce'
import { DefaultBattleCycle } from '../../gamesequence/BattleCycle'
import { logger } from '../../main'
import { PlayerContainer } from '../PlayerContainer'
import { PacificWarScenario } from '../Scenario'
import { random } from '../../utils/Utility'
import { ActivationStatus, Side } from '../../units/Interfaces'
import { NavalUnit } from '../../units/NavalUnit'
import { Force } from '../../forces/Force'
import { Hex } from '../Hex'
import { GameStatus } from '../GameStatus'

// override default battle cycle rules with scenario specific rules here
class ES1BattleCyle extends DefaultBattleCycle {
  public doLighting() {}
}

export class ES1 extends PacificWarScenario {
  private battleCycle!: DefaultBattleCycle
  private taskForces = new Array<TaskForce>()
  private force!: Force

  constructor() {
    super({
      name: 'Engagement Scenario 1 Pearl Harbor',
      number: 1,
      csvFile: 'es1.csv',
      numberBattleCycles: 2,
    })
    this.battleCycle = new ES1BattleCyle()

    // in this scenario, it is hard-wired to be DAY AM in first battle cycle, DAY_PM second battle cycle
    this.battleCycle.LightingCondition = LightingCondition.Day_AM
  }

  private createAlliedForce(alliedPlayer: PlayerContainer) {
    // just add all units to the force including the Base marker and set the hex (location)
    const oahuHex = new Hex(2860)

    const forceOptions = {
      side: Side.Allied,
      forceId: 1,
      units: [],
      location: oahuHex,
    }

    const force = new Force(forceOptions)

    for (const unit of alliedPlayer.Units) {
      // add all units to the same force
      force.addUnitToForce(unit)
    }

    GameStatus.print('\n')
    force.print()
    GameStatus.print('\n')
  }

  private createJapaneseTaskForces(japanesePlayer: PlayerContainer) {
    // creation of two Japanese Task Forces is random subject to the TF rules
    const taskForceOptions: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [],
      screen: [],
    }
    this.taskForces.push(new TaskForce(taskForceOptions))

    taskForceOptions.taskForceId = 2
    this.taskForces.push(new TaskForce(taskForceOptions))

    // get a random number (0 or 1) for the task force
    for (const unit of japanesePlayer.Units) {
      unit.ActivationStatus = ActivationStatus.Activated
      // if the ship is a CV add to core else add to screen
      const tf = random(0, 1)

      if (unit.Id.startsWith('CV')) {
        logger.debug(
          `Adding ${unit.Id}-${unit.Name} to task force ${tf + 1} (CORE)`
        )
        this.taskForces[tf].addUnitToCore(unit as NavalUnit)
      } else if (unit.isNavalUnit()) {
        logger.debug(
          `Adding ${unit.Id}-${unit.Name} to task force ${tf + 1} (SCREEN)`
        )
        try {
          this.taskForces[tf].addUnitToScreen(unit as NavalUnit)
        } catch (Error) {
          // tried to add to screen of one task force - add to other Instead
          logger.debug(
            `Error adding ${unit.Id} to task force ${
              tf + 1
            } -> add to task force ${((tf + 1) % 2) + 1} instead`
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
  }

  public setUpScenario(
    japanesePlayer: PlayerContainer,
    alliedPlayer: PlayerContainer
  ): void {
    GameStatus.print('Scenario Set Up -> Create Japanese Task Forces')
    this.createJapaneseTaskForces(japanesePlayer)

    GameStatus.print('Scenario Set Up -> Create Allied Force')
    this.createAlliedForce(alliedPlayer)
  }

  public get BattleCycle(): DefaultBattleCycle {
    return this.battleCycle
  }
}
