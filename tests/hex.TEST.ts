import { FileRow } from '../src/dataload'
import { Force } from '../src/forces/Force'
import {
  BlueReconInformation,
  GreenReconInformation,
  ReconInformation,
  RedReconInformation,
  TaskForce,
  TaskForceOptions
} from '../src/forces/TaskForce'
import { Main } from '../src/main'
import { ES1 } from '../src/scenarios/es1PearlHarbor/es1'
import { Hex } from '../src/map/Hex'
import { ActivationStatus, AircraftType, Side } from '../src/units/Interfaces'
import { NavalUnit, NavalUnitType } from '../src/units/NavalUnit'
import { DetectionLevel, SearchChart, SearchOptions, TimeOfDay } from '../src/displays/SearchCharts'
import { alliedSearchChartResults } from '../src/displays/AlliedSearchTables'
import { GameStatus } from '../src/scenarios/GameStatus'

const main = new Main(new ES1())

describe('Actions on Hex Location: Add Task Forces, Search, Perform Detection Actions', () => {
  let rows: FileRow[] | undefined

  beforeAll(async () => {
    await main.load()
    rows = main.Rows
    if (!rows) {
      throw Error('No rows were loaded')
    }
    main.mapRowsToUnits(rows)
    await main.setUpGame()
  })

  test('Add 2 Japanese TFs to a Hex - Search Result Green', async () => {
    const shokaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
    const kaga = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    const tone = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CA9')
    const kagero = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'DD9')
    const hiei = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB8')
    const kirishima = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB9')
    const zuikaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV6')
    const akagi = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV1')

    const taskForce1Options: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [kaga, akagi],
      screen: [kirishima, tone]
    }
    const taskForce1 = new TaskForce(taskForce1Options)
    expect(taskForce1.Core.length).toEqual(2)
    expect(taskForce1.Screen.length).toEqual(2)

    const taskForce2Options: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 2,
      core: [shokaku, zuikaku, hiei],
      screen: [kagero]
    }
    const taskForce2 = new TaskForce(taskForce2Options)
    expect(taskForce2.Core.length).toEqual(3)
    expect(taskForce2.Screen.length).toEqual(1)

    const japaneseTFHex = new Hex(3159)
    japaneseTFHex.addTaskForceToHex(taskForce1)
    japaneseTFHex.addTaskForceToHex(taskForce2)

    // 1. do search for the TFs
    const dieRoll = 2
    let options: SearchOptions = {
      navalSearchTable: alliedSearchChartResults,
      range: 3,
      dieRoll,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Day,
      DRM: -1
    }

    let result: DetectionLevel = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedGreen)

    // 2. with the detection result get the reconnaisance information from the Task Forces
    const reconInformation = taskForce1.getReconInformation(result) as GreenReconInformation
    expect(reconInformation.unitReport[NavalUnitType.AircraftCarrier]).toBe(2)
    expect(reconInformation.unitReport[NavalUnitType.Battleship]).toBe(1)
    expect(reconInformation.unitReport[NavalUnitType.HeavyCruiser]).toBe(1)

    const reconInformation2 = taskForce2.getReconInformation(result) as GreenReconInformation
    expect(reconInformation2.unitReport[NavalUnitType.AircraftCarrier]).toBe(2)
    expect(reconInformation2.unitReport[NavalUnitType.Battleship]).toBe(1)
    expect(reconInformation2.unitReport[NavalUnitType.HeavyCruiser]).toBe(undefined)
    expect(reconInformation2.unitReport[NavalUnitType.Destroyer]).toBe(1)
  })

  test('Add 2 Japanese TFs to a Hex - Search Result Blue', async () => {
    const shokaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
    const kaga = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    const tone = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CA9')
    const kagero = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'DD9')
    const hiei = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB8')
    const kirishima = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB9')
    const zuikaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV6')
    const akagi = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV1')

    const taskForce1Options: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [kaga, akagi],
      screen: [kirishima, tone]
    }
    const taskForce1 = new TaskForce(taskForce1Options)
    expect(taskForce1.Core.length).toEqual(2)
    expect(taskForce1.Screen.length).toEqual(2)

    const taskForce2Options: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 2,
      core: [shokaku, zuikaku, hiei],
      screen: [kagero]
    }
    const taskForce2 = new TaskForce(taskForce2Options)
    expect(taskForce2.Core.length).toEqual(3)
    expect(taskForce2.Screen.length).toEqual(1)

    const japaneseTFHex = new Hex(3159)
    japaneseTFHex.addTaskForceToHex(taskForce1)
    japaneseTFHex.addTaskForceToHex(taskForce2)

    // 1. do search for the TFs
    const dieRoll = 4
    let options: SearchOptions = {
      navalSearchTable: alliedSearchChartResults,
      range: 3,
      dieRoll,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Day,
      DRM: -1
    }

    let result: DetectionLevel = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedBlue)

    // 2. with the detection result get the reconnaisance information from the Task Forces
    const reconInformation = taskForce1.getReconInformation(result) as BlueReconInformation
    expect(reconInformation.numberCapitalShips).toBe(3)
    expect(reconInformation.numberNonCapitalShips).toBe(1)
    expect(reconInformation.carriers).toBe(true)

    const reconInformation2 = taskForce1.getReconInformation(result) as BlueReconInformation
    expect(reconInformation2.numberCapitalShips).toBe(3)
    expect(reconInformation2.numberNonCapitalShips).toBe(1)
    expect(reconInformation2.carriers).toBe(true)
  })

  test('Add 1 Japanese TF to a Hex - Search Result Red', async () => {
    const shokaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
    const kaga = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    const tone = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CA9')
    const kirishima = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB9')
    const akagi = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV1')

    const taskForce1Options: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [kaga, akagi, shokaku],
      screen: [kirishima, tone]
    }
    const taskForce1 = new TaskForce(taskForce1Options)
    expect(taskForce1.Core.length).toEqual(3)
    expect(taskForce1.Screen.length).toEqual(2)

    const japaneseTFHex = new Hex(3159)
    japaneseTFHex.addTaskForceToHex(taskForce1)

    // 1. do search for the TFs
    const dieRoll = 4
    let options: SearchOptions = {
      navalSearchTable: alliedSearchChartResults, // allies doing the searching
      range: 3,
      dieRoll,
      searchingAirUnitType: AircraftType.LRA,
      timeOfDay: TimeOfDay.Day,
      DRM: 0
    }

    let result: DetectionLevel = SearchChart.searchForNaval(options)
    expect(result).toBe(DetectionLevel.detectedRed)

    // 2. with the detection result get the reconnaisance information from the Task Forces
    const reconInformation = taskForce1.getReconInformation(result) as RedReconInformation
    expect(reconInformation.numberNavalUnits).toBeGreaterThanOrEqual(3)
    expect(reconInformation.numberNavalUnits).toBeLessThanOrEqual(7)
  })
})
