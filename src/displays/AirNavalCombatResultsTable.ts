import { logger } from '../main'
import { getDieRoll } from '../utils/Utility'

type IndexType = Array<Array<number>>
type StrengthDieRollLookUpType = Map<number, IndexType>
type AirCombatResultsType = Map<AirNavalCombatType, Array<number>>

export interface AirCombatResult {
  hits?: number, 
  criticalHit?: boolean, 
  troopQualityCheck?: boolean
}

export const TroopQualityCheck = -1
const zeroFour = -2

export enum AirNavalCombatType {
  CapvsUncoordinatedMission = 'CAP vs UnCoordinated Mission',
  CapvsCoordinatedMission = 'CAP vs Coordinated Mission',
  AirSupremacyvsCap = 'Air Supremacy vs CAP',
  UncoordinatedStrikevsCAP = 'UnCoordinated Strike vs CAP',
  CoordinatedStrikevsCAP = 'Coordinated Strike vs CAP',
  UnimprovedFlakvsAir = 'FLAK (Unimproved) vs Air',
  ImprovedFlakvsAir = 'Improved FLAK vs Air',
  FAirvsNaval = 'F Air vs Naval',
  TAirvsNaval = 'T Air vs Naval',
  BAirvsNaval = 'B Air vs Naval',
  AirvsInstallation = 'Air vs Installation',
  AirvsGroundUnit = 'Air vs Ground Unit',
  AirvsUnalertedAir = 'Air vs Unalerted (Grounded) Air',
  LongRangevsNaval = 'Long Range vs Naval',
  MediumRangvsNaval = 'Mediun Range vs Naval',
  ShortRangevsNaval = 'Short Range vs Naval',
  BombardmentvsInstallation = 'Bombardment vs Installation',
  BombardmentvsGroundUnit = 'Bombardment vs Ground Unit',
  SubOrNavalvsNaval = 'Submarine or Naval vs Naval',
  NavalvsSubmarine = 'Naval vs Submarine',
  NormalBombingFirst10 = 'NormalBombing (first 10 Uses)',
  FireBombing11 = 'FireBombing (starting with 11th Use)',
}


const zeroMinus = [[zeroFour]]
const zero: IndexType = [[1,9], [0]]
const one: IndexType = [[2,9], [1], [0]]
const two: IndexType = [[3,9], [2], [1], [0]]
const three: IndexType = [[4,9], [3], [2], [1], [0]]
const four: IndexType = [[5,9], [4], [3], [2], [1], [0]]
const five: IndexType = [[6,9], [5], [4], [3], [2], [1], [0]]
const six: IndexType = [[7,9], [6], [5], [4], [3], [2], [1], [0]]
const seven: IndexType = [[8,9], [7], [6], [5], [4], [3], [2], [1], [0]]
const eight: IndexType = [[9], [8], [7], [6], [5], [4], [3], [2], [1], [0]]
const nine: IndexType = [[10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]]
const ten: IndexType = [[10], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]]
const eleven: IndexType = [[10], [10], [10], [9], [8], [7], [6], [5], [4], [3], [2], [0,1]]
const twelve: IndexType = [[10], [10], [10], [10], [9], [8], [7], [6], [5], [4], [3], [0,2]]
const thirteen: IndexType = [[10], [10], [10], [10], [10], [9], [8], [7], [6], [5], [4], [0,3]]
const fourteen: IndexType = [[10], [10], [10], [10], [10], [10], [9], [8], [7], [6], [5], [0,4]]
const fifteen: IndexType = [[10], [10], [10], [10], [10], [10], [10], [9], [8], [7], [6], [0,5]]
const sixteen: IndexType = [[10], [10], [10], [10], [10], [10], [10], [10], [9], [8], [7], [0,6]]
const seventeen: IndexType = [[10], [10], [10], [10], [10], [10], [10], [10], [10], [9], [8], [0,7]]
const eighteen: IndexType = [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [9], [0,8]]
const nineteenPlus: IndexType = [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [10], [0,9]]

const dieRollLookupTable: StrengthDieRollLookUpType = new Map([
  [-1, zeroMinus],
  [0, zero],
  [1, one],
  [2, two],
  [3, three],
  [4, four],
  [5, five],
  [6, six],
  [7, seven],
  [8, eight],
  [9, nine],
  [10, ten],
  [11, eleven],
  [12, twelve],
  [13, thirteen],
  [14, fourteen],
  [15, fifteen],
  [16, sixteen],
  [17, seventeen],
  [18, eighteen],
  [19, nineteenPlus]
])


const airCombatResults: AirCombatResultsType = new Map([

  // Air Combat
  [AirNavalCombatType.CapvsUncoordinatedMission, [0,1,1,1,2,3,3,3,4,4,5,5]],
  [AirNavalCombatType.CapvsCoordinatedMission, [0,1,1,1,2,2,2,3,3,4,4,5]],
  [AirNavalCombatType.AirSupremacyvsCap, [0,1,1,1,2,3,3,3,4,4,5,5]],
  [AirNavalCombatType.UncoordinatedStrikevsCAP, [0,1,1,1,1,1,1,1,1,2,2,3]],
  [AirNavalCombatType.CoordinatedStrikevsCAP, [0,1,1,1,2,2,2,3,3,4,4,5]],

  // FLAK Combat
  [AirNavalCombatType.UnimprovedFlakvsAir, [0,1,1,1,1,1,1,1,1,2,2,3]],
  [AirNavalCombatType.ImprovedFlakvsAir, [0,1,1,1,1,2,2,3,3,3,4,6]],

  // Strike Combat
  [AirNavalCombatType.FAirvsNaval, [0,1,1,1,2,2,3,4,4,5,6,8]],
  [AirNavalCombatType.TAirvsNaval, [0,0,0,1,1,2,3,4,4,4,4,6]],
  [AirNavalCombatType.BAirvsNaval, [0,0,0,0,1,1,1,1,1,1,1,1]],
  [AirNavalCombatType.AirvsInstallation, [0,1,2,2,3,4,4,5,5,6,7,9]],
  [AirNavalCombatType.AirvsGroundUnit, [0,TroopQualityCheck,TroopQualityCheck,TroopQualityCheck,TroopQualityCheck,
    TroopQualityCheck,TroopQualityCheck,TroopQualityCheck,1,1,1,2]],

  // Strafe Combat
  [AirNavalCombatType.AirvsUnalertedAir, [0,1,2,2,3,3,3,4,4,5,5,5]],

  // Naval Gunnery Combat
  [AirNavalCombatType.LongRangevsNaval, [0,1,1,1,1,1,1,1,2,2,3,3]],
  [AirNavalCombatType.MediumRangvsNaval, [0,1,1,1,1,1,2,2,3,3,4,4]],
  [AirNavalCombatType.ShortRangevsNaval, [0,1,1,1,2,2,3,3,3,4,5,7]],
  [AirNavalCombatType.BombardmentvsInstallation, [0,1,2,2,3,4,4,5,5,6,7,9]],
  [AirNavalCombatType.BombardmentvsGroundUnit, [0,TroopQualityCheck,TroopQualityCheck,TroopQualityCheck,TroopQualityCheck,
    TroopQualityCheck,TroopQualityCheck,TroopQualityCheck,1,1,1,2]],

  // Torpedo Combat
  [AirNavalCombatType.SubOrNavalvsNaval, [0,1,1,2,2,3,3,3,4,5,6,8]],

  // Anti-Submarin Combat
  [AirNavalCombatType.NavalvsSubmarine, [0,1,1,1,1,1,1,1,1,1,1,1]],

  // Strategic Bombing
  [AirNavalCombatType.NormalBombingFirst10, [0,1,1,2,2,2,2,2,2,3,3,5]],
  [AirNavalCombatType.FireBombing11, [0,3,5,7,9,10,11,13,14,15,16,17]],
])

// use die roll to get the correct row...that row (index) is the same as the number of hits in the Critical Hit table
const criticalHitTable: IndexType = [
  [0,5], 
  [6,7],
  [8],
  [9]
]

export class AirNavalCombatResultsTable {
  private static criticalHit: boolean = false;

  public static getHitsFor(modifiedStrength: number, dieRoll: number, combatType: AirNavalCombatType,): AirCombatResult {
    const index = AirNavalCombatResultsTable.getIndexFor(modifiedStrength, dieRoll)
    return AirNavalCombatResultsTable.determineAirCombatHits(combatType, index, dieRoll)
  }

  public static getIndexFor(modifiedStrength: number, dieRoll: number, secondDieRoll?: number) {
    AirNavalCombatResultsTable.criticalHit = false;

    // first get the row of the look up table for the strength given
    let key = modifiedStrength
    if (modifiedStrength < 0) {
      key = -1
    }
    if (modifiedStrength > 19) {
      key = 19
    }
    const lookup: IndexType | undefined = dieRollLookupTable.get(key)

    // then use the lookup to get the range of values possible, then use the die roll to index into this range
    // and get the final index to use in the hits table
    if (!lookup) {
      throw Error(`No result found in table for modified strength: ${modifiedStrength}`)
    }

    let indexIntoHits: number = 0

    lookup.map((row, index) => {
      if (key === -1) {
        const dieRoll2 = secondDieRoll != undefined ? secondDieRoll : getDieRoll() // pass in second die roll in tests
        if (dieRoll2 <= 4) {
          indexIntoHits = 1
          if (dieRoll2 === 0) {
            logger.debug(`second die roll = 0: AirNavalCombatResultsTable.criticalHit = true`)

            AirNavalCombatResultsTable.criticalHit = true
          }
          return
        }
      }
      else if (dieRoll >= row[0] && dieRoll <= row[row.length - 1]) {
        indexIntoHits = index
        if (dieRoll === 0) {
          logger.debug(`die roll = 0: AirNavalCombatResultsTable.criticalHit = true`)
          AirNavalCombatResultsTable.criticalHit = true
        }
        return
      }
    })
    logger.debug(`indexIntoHits = ${indexIntoHits}`)
    return indexIntoHits
  }

  public static getCriticalHits(dieRoll: number): number {
    let indexIntoHits: number = 0

    criticalHitTable.map((row, index) => {
     if (dieRoll >= row[0] && dieRoll <= row[row.length - 1]) {
        indexIntoHits = index
        return
      }
    })
    logger.debug(`critical hits indexIntoHits = ${indexIntoHits}`)
    return indexIntoHits
  }

  public static determineAirCombatHits(combatType: AirNavalCombatType, index: number, dieRoll: number): AirCombatResult {
    const hitsArray = airCombatResults.get(combatType)

    if (!hitsArray) {
      throw Error('No row of results found for combat type ' + combatType)
    }
    let hits = hitsArray[index]

    if (hits === TroopQualityCheck) {
      return { troopQualityCheck: true }
    }
    return { hits: hits, troopQualityCheck: false, criticalHit: AirNavalCombatResultsTable.criticalHit}
  }
}


