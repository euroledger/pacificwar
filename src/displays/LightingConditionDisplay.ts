// class to set and provide the current lighting condition
import { getDieRoll } from '../utils/Utility'

export enum LightingCondition {
  Day_PM = 'Day PM',
  Dusk = 'Dusk',
  Night = 'Night',
  Day_AM = 'Day AM',
  Random = 'Random',
}

type IndexType = Array<Array<number>>
type RandomLightingType = Map<number, number>

const randomLightingTableIndexes: IndexType = [[0, 1], [2], [3, 9]]

export class LightingConditionDisplay {
  private static lightingConditionIndex: number = 0

  private static randomLightingTable: RandomLightingType = new Map([
    [0, Object.keys(LightingCondition).indexOf(LightingCondition.Night)],
    [1, Object.keys(LightingCondition).indexOf(LightingCondition.Dusk)],
    [2, Object.keys(LightingCondition).indexOf(LightingCondition.Day_PM)],
])

  public static incrementLightingDisplay(increment: number): void {
    this.lightingConditionIndex =
      (this.lightingConditionIndex + increment) % Object.values(LightingCondition).length
    if (this.LightingCondition === LightingCondition.Random) {
      this.determineRandomLighting(getDieRoll())
    }
  }

  public static determineRandomLighting(dieRoll: number) {
    randomLightingTableIndexes.map((row, index) => {
      if (dieRoll >= row[0] && dieRoll <= row[row.length - 1]) {
        const key: number | undefined = this.randomLightingTable.get(index)
        if (!key) {
            throw Error(`Die Roll ${dieRoll} out of range`)
        }
        LightingConditionDisplay.lightingConditionIndex = key
        return
      }
    })
  }

  public static set LightingCondition(condition: LightingCondition) {
    this.lightingConditionIndex = Object.values(LightingCondition).indexOf(condition)
  }

  public static get LightingCondition(): LightingCondition {
    return Object.values(LightingCondition)[this.lightingConditionIndex]
  }
}
