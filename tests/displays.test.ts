import {
  AirNavalCombatResultsTable,
} from '../src/displays/AirNavalCombatResultsTable'
import { alliedAirSearchChartResults, alliedSearchChartResults as alliedNavalSearchChartResults } from '../src/displays/AlliedSearchTables'
import { AirNavalCombatType } from '../src/displays/interfaces'
import { japaneseNavalSearchChartResults } from '../src/displays/JapaneseSearchTables'
import {
  LightingCondition,
  LightingConditionDisplay,
} from '../src/displays/LightingConditionDisplay'
import {
  SearchChart,
  DetectionLevel,
  SearchOptions,
  TimeOfDay,
} from '../src/displays/SearchCharts'
import { GameStatus } from '../src/scenarios/GameStatus'
import { AircraftType } from '../src/units/Interfaces'

GameStatus.TestMode = true
describe('Pacific War Displays', () => {
  test('Lighting Condition Display', async () => {
    const lightingCondition = LightingConditionDisplay.LightingCondition

    expect(lightingCondition).toBe(LightingCondition.Day_PM)

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
    result = AirNavalCombatResultsTable.getHitsFor(
      modifiedStrength,
      dieRoll,
      AirNavalCombatType.CapvsCoordinatedMission
    )
    expect(result.hits).toBe(3)

    modifiedStrength = 8
    dieRoll = 9
    result = AirNavalCombatResultsTable.getHitsFor(
      modifiedStrength,
      dieRoll,
      AirNavalCombatType.FAirvsNaval
    )
    expect(result.hits).toBe(0)

    modifiedStrength = 12
    dieRoll = 3
    result = AirNavalCombatResultsTable.getHitsFor(
      modifiedStrength,
      dieRoll,
      AirNavalCombatType.UncoordinatedStrikevsCAP
    )
    expect(result.hits).toBe(2)

    modifiedStrength = 8
    dieRoll = 0
    result = AirNavalCombatResultsTable.getHitsFor(
      modifiedStrength,
      dieRoll,
      AirNavalCombatType.TAirvsNaval
    )
    expect(result.hits).toBe(4)
    expect(result.criticalHit).toBe(true)

    modifiedStrength = 8
    dieRoll = 3
    result = AirNavalCombatResultsTable.getHitsFor(
      modifiedStrength,
      dieRoll,
      AirNavalCombatType.AirvsGroundUnit
    )
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

  test('Allied Search Chart - LRA air unit searching for Naval', async () => {
    let options: SearchOptions = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 6,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Day,
    }

    let result: DetectionLevel = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedBlue)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 5,
      dieRoll: 2,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)
    
    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 5,
      dieRoll: 3,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 5,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 1,
      dieRoll: 2,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedBlue)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 2,
      dieRoll: 3,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)

    
    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 7,
      dieRoll: 0,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 8,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.B,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedGreen)
  })

  test('Allied Search Chart - F,T or B air unit searching for Naval', async () => {
    let options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.F,
      timeOfDay: TimeOfDay.Day,
    }

    let result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedGreen)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 8,
      searchingAirUnitType: AircraftType.T,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 6,
      searchingAirUnitType: AircraftType.T,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedBlue)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 0,
      searchingAirUnitType: AircraftType.T,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedGreen)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 1,
      dieRoll: 5,
      searchingAirUnitType: AircraftType.T,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 8,
      dieRoll: 0,
      searchingAirUnitType: AircraftType.F,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)
  })

  test('Allied Search Chart - Spotter air unit searching for Naval', async () => {
    let options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    let result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedGreen)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 8,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 4,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 3,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 1,
      dieRoll: 5,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)

    options = {
      navalSearchTable: alliedNavalSearchChartResults,
      range: 0,
      dieRoll: 3,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedBlue)
  })

  test('Allied Search Chart -Search For Air', async () => {
    let options = {
      airSearchTable: alliedAirSearchChartResults,
      range: 0,
      dieRoll: 1,
      timeOfDay: TimeOfDay.Day,
    }

    let result = SearchChart.searchForAir(options)
    expect(result).toBe(DetectionLevel.detectedGreen)

    options = {
      airSearchTable: alliedAirSearchChartResults,
      range: 0,
      dieRoll: 6,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForAir(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      airSearchTable: alliedAirSearchChartResults,
      range: 0,
      dieRoll: 2,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForAir(options)
    expect(result).toBe(DetectionLevel.detectedBlue)

    options = {
      airSearchTable: alliedAirSearchChartResults,
      range: 0,
      dieRoll: 6,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForAir(options)
    expect(result).toBe(DetectionLevel.undetected)
  })

  test('Japanese Search Chart - F,T or B air unit searching for Naval', async () => {
    let options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 3,
      dieRoll: 3,
      searchingAirUnitType: AircraftType.F,
      timeOfDay: TimeOfDay.Day,
    }

    let result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 1,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.T,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 2,
      dieRoll: 0,
      searchingAirUnitType: AircraftType.T,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 3,
      dieRoll: 0,
      searchingAirUnitType: AircraftType.T,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)

  })

  test('Japanese Search Chart - Spotter air unit searching for Naval', async () => {
    let options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 3,
      dieRoll: 2,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    let result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 4,
      dieRoll: 0,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedBlue)

    options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 4,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 6,
      dieRoll: 0,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 7,
      dieRoll: 5,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Day,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.undetected)

    options = {
      navalSearchTable: japaneseNavalSearchChartResults,
      range: 1,
      dieRoll: 1,
      searchingAirUnitType: AircraftType.Spotter,
      timeOfDay: TimeOfDay.Night,
    }

    result = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedBlue)
  })
})
