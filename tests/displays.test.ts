import {
  AirNavalCombatResultsTable,
  AirNavalCombatType,
} from '../src/displays/AirNavalCombatResultsTable'
import {
  LightingCondition,
  LightingConditionDisplay,
} from '../src/displays/LightingConditionDisplay'

describe('Pacific War Displays', () => {
  test('Lighting Condition Display', async () => {
    expect(LightingConditionDisplay.LightingCondition).toBe(
      LightingCondition.Day_PM
    )

    LightingConditionDisplay.incrementLightingDisplay(2)
    expect(LightingConditionDisplay.LightingCondition).toBe(
      LightingCondition.Night
    )

    LightingConditionDisplay.determineRandomLighting(0)
    expect(LightingConditionDisplay.LightingCondition).toBe(
      LightingCondition.Night
    )

    LightingConditionDisplay.determineRandomLighting(2)
    expect(LightingConditionDisplay.LightingCondition).toBe(
      LightingCondition.Dusk
    )
  })

  test('Air/Naval Combat Results Table', async () => {
    let modifiedStrength = 11
    let dieRoll = 1
    let index = AirNavalCombatResultsTable.getIndexFor(
      modifiedStrength,
      dieRoll
    )
    expect(index).toBe(11)

    // use this index to lookup number of hits for the correct type of air combat
    let result = AirNavalCombatResultsTable.determineAirCombatHits(
      AirNavalCombatType.AirSupremacyvsCap,
      index,
      dieRoll
    )
    expect(result.hits).toBe(5)

    modifiedStrength = 8
    dieRoll = 2
    result = AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatType.CapvsCoordinatedMission)
    expect(result.hits).toBe(3)

    modifiedStrength = 12
    dieRoll = 3
    result = AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatType.UncoordinatedStrikevsCAP)
    expect(result.hits).toBe(2)

    modifiedStrength = 8
    dieRoll = 0
    result = AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatType.TAirvsNaval)
    expect(result.hits).toBe(4)
    expect(result.criticalHit).toBe(true)

    modifiedStrength = 8
    dieRoll = 3
    result = AirNavalCombatResultsTable.getHitsFor(modifiedStrength, dieRoll, AirNavalCombatType.AirvsGroundUnit)
    expect(result.troopQualityCheck).toBe(true)
    expect(result.criticalHit).toBe(undefined)

    modifiedStrength = -1
    dieRoll = 0
    let secondDieRoll = 3
    index = AirNavalCombatResultsTable.getIndexFor(
      modifiedStrength,
      dieRoll,
      secondDieRoll
    )
    expect(index).toBe(1)

    // use this index to lookup number of hits for the correct type of air combat
    result = AirNavalCombatResultsTable.determineAirCombatHits(
      AirNavalCombatType.ImprovedFlakvsAir,
      index,
      dieRoll
    )
    expect(result.hits).toBe(1)
    expect(result.criticalHit).toBe(false)

    modifiedStrength = -1
    dieRoll = 0
    secondDieRoll = 0

    index = AirNavalCombatResultsTable.getIndexFor(
      modifiedStrength,
      dieRoll,
      secondDieRoll
    )
    expect(index).toBe(1)

    // use this index to lookup number of hits for the correct type of air combat
    result = AirNavalCombatResultsTable.determineAirCombatHits(
      AirNavalCombatType.ImprovedFlakvsAir,
      index,
      dieRoll
    )
    expect(result.criticalHit).toBe(true)
  })

  test('Air/Naval Combat -> Critical Hits Table', async () => {
    let dieRoll = 0
    let hits = AirNavalCombatResultsTable.getCriticalHits(dieRoll)
    expect(hits).toBe(0)

    dieRoll = 6
    hits = AirNavalCombatResultsTable.getCriticalHits(dieRoll)
    expect(hits).toBe(1)

    
    dieRoll = 7
    hits = AirNavalCombatResultsTable.getCriticalHits(dieRoll)
    expect(hits).toBe(1)

    
    dieRoll = 8
    hits = AirNavalCombatResultsTable.getCriticalHits(dieRoll)
    expect(hits).toBe(2)

    
    dieRoll = 9
    hits = AirNavalCombatResultsTable.getCriticalHits(dieRoll)
    expect(hits).toBe(3)
  })
})
