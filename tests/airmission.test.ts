import {
  AirMissionSchematic,
  AirMissionSchematicOptions,
  AirMissionType,
} from '../src/airmissions/AirMissionSchematic'
import {
  AirStrikeTarget,
  AirStrikeTargetOptions,
} from '../src/airmissions/AirStrikeTarget'
import { FileRow } from '../src/dataload'
import {
  AirNavalCombatResultsTable,
  AirNavalCombatType,
} from '../src/displays/AirNavalCombatResultsTable'
import { Force } from '../src/forces/Force'
import { TaskForce, TaskForceOptions } from '../src/forces/TaskForce'
import { Main } from '../src/main'
import {
  ES1,
  ES1AirMissionSchematic,
} from '../src/scenarios/es1PearlHarbor/es1'
import { GameStatus } from '../src/scenarios/GameStatus'
import { Hex } from '../src/map/Hex'
import { BaseSize, Type } from '../src/units/AbstractUnit'
import { AirUnit } from '../src/units/AirUnit'
import { BaseUnit } from '../src/units/BaseUnit'
import { Side } from '../src/units/Interfaces'
import { NavalUnit } from '../src/units/NavalUnit'
import { random } from '../src/utils/Utility'

describe('Air Mission Schmatic', () => {
  let rows: FileRow[] | undefined
  const main = new Main(new ES1())
  let airStrikeTargets: AirStrikeTarget[]
  let airMission: ES1AirMissionSchematic

  beforeAll(async () => {
    await main.load()
    rows = main.Rows
    if (!rows) {
      throw Error('No rows were loaded')
    }
    main.mapRowsToUnits(rows)
    await main.setUpGame()
  })
  test('Air Mission Preliminary Procedure', async () => {
    const akagi = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV1')
    const kaga = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    const hiryu = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV3')
    const soryu = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV4')
    const shokaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
    const zuikaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV6')

    const tone = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CA9')
    const kagero = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'DD9')
    const hiei = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB8')
    const kirishima = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB9')

    const taskForceOptions1: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [akagi, kaga, hiryu],
      screen: [tone, kagero],
    }
    const taskForce1 = new TaskForce(taskForceOptions1)
    const carrierAirUnits1 = taskForce1.AirUnits

    const taskForceOptions2: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 2,
      core: [soryu, shokaku, zuikaku],
      screen: [hiei, kirishima],
    }
    const taskForce2 = new TaskForce(taskForceOptions2)
    const carrierAirUnits2 = taskForce2.AirUnits

    const missionAirUnits = carrierAirUnits1.concat(carrierAirUnits2)
    expect(missionAirUnits.length).toBe(6)

    const airMissionOptions: AirMissionSchematicOptions = {
      airMissionType: AirMissionType.AirStrike,
      missionAirUnits: missionAirUnits,
      startHex: new Hex(3159),
      targetHex: new Hex(2860),
    }
    airMission = new ES1AirMissionSchematic(airMissionOptions)
    const minLevel = airMission.getLowestStatusLevelOfMissionAirUnits()
    expect(minLevel).toBe(2)

    let coordinated = airMission.isCoordinated(4)
    expect(coordinated).toBe(true)
    coordinated = airMission.isCoordinated(7)
    expect(coordinated).toBe(false)
  })

  test('Air Mission Designate Strike Targets in Force containing air and naval units', async () => {
    const options = {
      name: 'Oahu',
      type: Type.Base,
      side: Side.Allied,
      id: '',
      aaStrength: 3,
      launchCapacity: 18,
      size: BaseSize.Large,
      hexLocation: 2860,
    }
    const oahuBase = new BaseUnit(options)

    const california = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB10')
    const nevada = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB1')
    const tennessee = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB11')
    const maryland = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB8')
    const oklahoma = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB3')
    const westvirginia = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB9')
    const arizona = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB4')
    const pennsylvania = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB2')

    const pg18 = Main.Mapper.getUnitById<AirUnit>(
      Side.Allied,
      '18th Pursuit Group'
    )
    const pg15 = Main.Mapper.getUnitById<AirUnit>(
      Side.Allied,
      '15th Pursuit Group'
    )
    const bg11 = Main.Mapper.getUnitById<AirUnit>(
      Side.Allied,
      '11th Bomber Group'
    )
    const bg5 = Main.Mapper.getUnitById<AirUnit>(
      Side.Allied,
      '5th Bomber Group'
    )
    const pw1 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '1st Patrol Wing')
    const pw2 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd Patrol Wing')

    const oahuHex = new Hex(2860)

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
        pg15,
        pg18,
        bg5,
        bg11,
        pw1,
        pw2,
      ],
      location: oahuHex,
    }

    const force = new Force(forceOptions)
    oahuHex.addForceToHex(force)

    const cad1 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD1')
    const cad2 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD2')
    const cad3 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD3')
    const cad4 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD4')
    const cad5 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD5')
    const cad6 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD6')

    const missionAirUnits = [cad1, cad2, cad3, cad4, cad5, cad6]

    const airMissionOptions: AirMissionSchematicOptions = {
      airMissionType: AirMissionType.AirStrike,
      missionAirUnits: missionAirUnits,
      startHex: new Hex(3159),
      targetHex: new Hex(2860),
    }
    airMission = new ES1AirMissionSchematic(airMissionOptions)

    const battleshipsAtTarget = force.NavalUnits.filter((unit) =>
      unit.Id.startsWith('BB')
    )

    airStrikeTargets = airMission.allocateStrikeTargets(
      missionAirUnits,
      force.AirUnits,
      battleshipsAtTarget
    )
    expect(airStrikeTargets.length).toBe(6)
  })

  test('Resolve Air Strike vs Naval Unit', async () => {
    const california = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB10')

    const navalTargets = airStrikeTargets.filter(
      (target) => target.AirNavalCombatType === AirNavalCombatType.FAirvsNaval
    )
    california.Hits = 0
    const ships = [california]

    const cad1 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD1') // Kaga air group, anti-naval strength 5

    const options: AirStrikeTargetOptions = {
      attacker: cad1,
      combatType: AirNavalCombatType.FAirvsNaval,
      navalTargets: ships,
    }
    const airStrike = new AirStrikeTarget(options)

    airMission.FirstAttack = false
    airMission.resolveAirStrikesvsNaval(airStrike, 5, 0)

    expect(california.Hits).toBe(2)

    // test critical hit on first strike
    california.Hits = 0
    airMission.FirstAttack = true
    airMission.resolveAirStrikesvsNaval(airStrike, 0, 9)
    expect(california.Hits).toBe(14)
  })

  test('Resolve Strafe vs Unalerted (Grounded) Air Unit', async () => {
    const pg18 = Main.Mapper.getUnitById<AirUnit>(
      Side.Allied,
      '18th Pursuit Group'
    )
    pg18.Steps = 6

    const cad1 = Main.Mapper.getUnitById<AirUnit>(Side.Japan, 'CAD1') // anit-air strength is 6 (printed 7 -1 as it has 5 steps)

    const options: AirStrikeTargetOptions = {
      attacker: cad1,
      combatType: AirNavalCombatType.FAirvsNaval,
      airTarget: pg18
    }
    const airStrike = new AirStrikeTarget(options)

    airMission.FirstAttack = false
    airMission.resolveStrafevsUnalertedAir(airStrike, 1)

    expect(pg18.Hits).toBe(6)
    expect(pg18.Steps).toBe(0)
    expect(pg18.Eliminated).toBe(true)
  })
})
