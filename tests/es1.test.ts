import { AirMissionSchematicOptions, AirMissionType } from '../src/airmissions/AirMissionSchematic'
import { AirStrikeTarget } from '../src/airmissions/AirStrikeTarget'
import { FileRow } from '../src/dataload'
import { Force, ForceOptions } from '../src/forces/Force'
import { TaskForceOptions, TaskForce } from '../src/forces/TaskForce'
import { Main } from '../src/main'
import { Hex } from '../src/map/Hex'
import { ES1, ES1AirMissionSchematic } from '../src/scenarios/es1PearlHarbor/es1'
import { GameStatus } from '../src/scenarios/GameStatus'
import { Type } from '../src/units/AbstractUnit'
import { AirUnit } from '../src/units/AirUnit'
import { BaseSize, BaseUnit } from '../src/units/BaseUnit'
import { Side } from '../src/units/Interfaces'
import { NavalUnit } from '../src/units/NavalUnit'

describe('Battle Cycle 2 Air Strike', () => {
  let rows: FileRow[] | undefined
  const main = new Main(new ES1())
  let airStrikeTargets: AirStrikeTarget[]
  let airMission: ES1AirMissionSchematic
  let akagi: NavalUnit
  let kaga: NavalUnit
  let hiryu: NavalUnit
  let soryu: NavalUnit
  let shokaku: NavalUnit
  let zuikaku: NavalUnit
  let tone: NavalUnit
  let kagero: NavalUnit
  let hiei: NavalUnit
  let kirishima: NavalUnit
  let maw2: AirUnit
  let pg18: AirUnit
  let pg15: AirUnit
  let bg11: AirUnit
  let bg5: AirUnit
  let pw1: AirUnit
  let pw2: AirUnit
  let cad1: AirUnit
  let cad2: AirUnit
  let cad3: AirUnit
  let cad4: AirUnit
  let cad5: AirUnit
  let cad6: AirUnit
  let california: NavalUnit
  let nevada: NavalUnit
  let tennessee: NavalUnit
  let maryland: NavalUnit
  let oklahoma: NavalUnit
  let westvirginia: NavalUnit
  let arizona: NavalUnit
  let pennsylvania: NavalUnit
  let oahuHex = new Hex(2860)
  let taskForceOptions1: TaskForceOptions
  let taskForce1: TaskForce
  let taskForceOptions2: TaskForceOptions
  let taskForce2: TaskForce
  let force: Force
  const hex = new Hex(3519)
  let forceOptions: ForceOptions
  const options = {
    name: 'Oahu',
    type: Type.Base,
    side: Side.Allied,
    id: '',
    aaStrength: 3,
    launchCapacity: 18,
    size: BaseSize.Large,
    hexLocation: 2860
  }
  const oahuBase = new BaseUnit(options)
  let airMissionOptions: AirMissionSchematicOptions
  let missionAirUnits: AirUnit[]

  const setUpOahuForce = () => {
    california = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB10')
    nevada = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB1')
    tennessee = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB11')
    maryland = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB8')
    oklahoma = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB3')
    westvirginia = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB9')
    arizona = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB4')
    pennsylvania = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB2')

    const ca6 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CA6')
    const cl3 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CL3')
    const cl2 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CL2')
    const dd5 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD5')
    const dd3 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD3')
    const dd7 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD7')
    const dd4 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD4')
    const apd1 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'APD1')
    const apd2 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'APD2')
    const cl4 = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CL4')

    pg18 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '18th Pursuit Group')
    pg15 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '15th Pursuit Group')
    bg11 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '11th Bomber Group')
    bg5 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '5th Bomber Group')
    pw1 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '1st Patrol Wing')
    pw2 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd Patrol Wing')

    oahuHex = new Hex(2860)

    const forceOptions = {
      side: Side.Allied,
      forceId: 1,
      units: [
        oahuBase,
        california,
        nevada,
        tennessee,
        maryland,
        oklahoma,
        westvirginia,
        arizona,
        pennsylvania,
        ca6,
        cl3,
        cl4,
        cl2,
        dd5,
        dd3,
        dd7,
        dd4,
        apd1,
        apd2,
        pg15,
        pg18,
        bg5,
        bg11,
        pw1,
        pw2
      ],
      location: oahuHex
    }

    force = new Force(forceOptions)
    oahuHex.addForceToHex(force)
  }

  const setUpJapanesAirStrike = () => {
    // set up Japanese air units and air strike
    missionAirUnits = [cad1, cad2, cad3, cad4, cad5, cad6]

    airMissionOptions = {
      airMissionType: AirMissionType.AirStrike,
      missionAirUnits: missionAirUnits,
      startHex: new Hex(3159),
      targetHex: oahuHex
    }
    airMission = new ES1AirMissionSchematic(airMissionOptions)
  }

  beforeAll(async () => {
    await main.load()
    rows = main.Rows
    if (!rows) {
      throw Error('No rows were loaded')
    }
    main.mapRowsToUnits(rows)
    await main.setUpGame()
    akagi = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV1')
    kaga = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    hiryu = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV3')
    soryu = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV4')
    shokaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
    zuikaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV6')

    tone = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CA9')
    kagero = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'DD9')
    hiei = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB8')
    kirishima = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB9')

    maw2 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd MAW')
    pg18 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '18th Pursuit Group')
    pg15 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '15th Pursuit Group')
    bg11 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '11th Bomber Group')
    bg5 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '5th Bomber Group')
    pw1 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '1st Patrol Wing')
    pw2 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd Patrol Wing')

    cad1 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD1')
    cad2 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD2')
    cad3 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD3')
    cad4 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD4')
    cad5 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD5')
    cad6 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD6')

    cad1.Hits = 1
    cad2.Hits = 1
    cad3.Hits = 2
    cad4.Hits = 2
    cad5.Hits = 0
    cad6.Hits = 0
  })

  test('Allocate Air Strike Targets, Air Strike Detected', async () => {
    setUpJapanesAirStrike()
    airMission.Detected = true

    // assume some hits from CAP and flak
    cad6.Hits = 2
    cad5.Hits = 1
    cad6.Aborted = true

    setUpOahuForce()

    // Allocate hits to ships and air units from first wave
    westvirginia.Hits = 4
    california.Hits = 4
    maryland.Hits = 4
    tennessee.Hits = 4
    nevada.Hits = 4
    pennsylvania.Hits = 4

    pg18.Hits = 4
    // Japanese player needs 2 more hits on battleships and 8 more hits on air units
    // => if detected, resolve air to air combat then allocate targets to the two battleships

    // => if undetected, allocate targets:
    // 1. Calculate percentage of hits achieved against ships, and air units
    // 2. Allocate that percentage of avaialable air units to each set of targets
    // 3. Example:
    //    a) 4 more hits needed on ships, 4 more hits needed against air -> split 50/50 surplus goes to attack naval
    //    b) 2 more hits needed on ships, 8 on air -> one units attack naval, five attack air

    // air units will strafe the unalerted air units
    expect(cad6.Aborted).toBe(true)

    const battleshipsAtTarget = force.NavalUnits.filter((unit) => unit.Id.startsWith('BB'))
    expect(battleshipsAtTarget.length).toBe(8)

    ES1.battleshipsWith4HitsOrMore = force.NavalUnits.filter((unit) => unit.Id.startsWith('BB') && unit.Hits >= 4)
    expect(ES1.battleshipsWith4HitsOrMore.length).toBe(6)
    let airStrikeTargets: AirStrikeTarget[] = airMission.allocateStrikeTargetsBattleCycle2(
      missionAirUnits,
      force.AirUnits,
      force.NavalUnits
    )
    expect(airStrikeTargets.length).toBe(5)
    expect(airStrikeTargets[0].NavalTargets.length).toBe(3)

    // now set hits so that further attacks on battleships are required
    tennessee.Hits = 3
    nevada.Hits = 3
    pennsylvania.Hits = 3

    ES1.battleshipsWith4HitsOrMore = force.NavalUnits.filter((unit) => unit.Id.startsWith('BB') && unit.Hits >= 4)
    GameStatus.navalUnitHits = 21
    expect(ES1.battleshipsWith4HitsOrMore.length).toBe(3)
    airStrikeTargets = airMission.allocateStrikeTargetsBattleCycle2(missionAirUnits, force.AirUnits, force.NavalUnits)
    const cad1Instances = airStrikeTargets.reduce((a, c) => (c.Attacker.Id === 'CAD1' ? ++a : a), 0)
    const cad2Instances = airStrikeTargets.reduce((a, c) => (c.Attacker.Id === 'CAD2' ? ++a : a), 0)
    const cad3Instances = airStrikeTargets.reduce((a, c) => (c.Attacker.Id === 'CAD3' ? ++a : a), 0)
    const cad4Instances = airStrikeTargets.reduce((a, c) => (c.Attacker.Id === 'CAD4' ? ++a : a), 0)
    const cad5Instances = airStrikeTargets.reduce((a, c) => (c.Attacker.Id === 'CAD5' ? ++a : a), 0)
    const cad6Instances = airStrikeTargets.reduce((a, c) => (c.Attacker.Id === 'CAD6' ? ++a : a), 0)

    expect(cad1Instances).toBe(1)
    expect(cad2Instances).toBe(1)
    expect(cad3Instances).toBe(1)
    expect(cad4Instances).toBe(1)
    expect(cad5Instances).toBe(1)
    expect(cad6Instances).toBe(0) // cad6 aborted

    let cad5Targets = airStrikeTargets.filter((unit) => (unit.Attacker.Id === 'CAD5'))

    let cad5BBTargets = cad5Targets[0].NavalTargets.reduce((a,c) => (c.Id.startsWith('BB') && c.Hits> 0 ? ++a : a), 0)
    expect(cad5BBTargets).toBe(3)

    // now assume a bad first battle cycle airstrike - all air units will attack the same 6 battleships 
    westvirginia.Hits = 1
    california.Hits = 1
    maryland.Hits = 1
    tennessee.Hits = 0
    nevada.Hits = 0
    pennsylvania.Hits = 0

    GameStatus.navalUnitHits = 3
    airStrikeTargets = airMission.allocateStrikeTargetsBattleCycle2(missionAirUnits, force.AirUnits, force.NavalUnits)
    expect(airStrikeTargets.length).toBe(5) // only 5 non-aborted air units
    cad5Targets = airStrikeTargets.filter((unit) => (unit.Attacker.Id === 'CAD5'))
    cad5BBTargets = cad5Targets[0].NavalTargets.reduce((a,c) => (c.Id.startsWith('BB') ? ++a : a), 0)
    expect(cad5BBTargets).toBe(6)

  })
})
