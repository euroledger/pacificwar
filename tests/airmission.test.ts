import { AirCombatOptions, AirMissionSchematic, AirMissionSchematicOptions, AirMissionType } from '../src/airmissions/AirMissionSchematic'
import { AirStrikeTarget, AirStrikeTargetOptions } from '../src/airmissions/AirStrikeTarget'
import { FileRow } from '../src/dataload'
import { Force } from '../src/forces/Force'
import { TaskForce, TaskForceOptions } from '../src/forces/TaskForce'
import { Main } from '../src/main'
import { ES1, ES1AirMissionSchematic } from '../src/scenarios/es1PearlHarbor/es1'
import { Hex } from '../src/map/Hex'
import { BaseSize, Type } from '../src/units/AbstractUnit'
import { AirUnit } from '../src/units/AirUnit'
import { BaseUnit } from '../src/units/BaseUnit'
import { Side } from '../src/units/Interfaces'
import { NavalUnit } from '../src/units/NavalUnit'
import { AirNavalCombatType } from '../src/displays/interfaces'
import { AirNavalCombatResultsTable } from '../src/displays/AirNavalCombatResultsTable'

describe('Air Mission Schmatic', () => {
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
  let pg18: AirUnit
  let pg15: AirUnit
  let bg11: AirUnit
  let bg5: AirUnit
  let pw1: AirUnit
  let pw2: AirUnit
  let oahuBase: BaseUnit

  let oahuHex = new Hex(2860)

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

    pg18 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '18th Pursuit Group')
    pg15 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '15th Pursuit Group')
    bg11 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '11th Bomber Group')
    bg5 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '5th Bomber Group')
    pw1 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '1st Patrol Wing')
    pw2 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd Patrol Wing')
  })
  test('Air Mission Preliminary Procedure', async () => {
    const taskForceOptions1: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [akagi, kaga, hiryu],
      screen: [tone, kagero]
    }
    const taskForce1 = new TaskForce(taskForceOptions1)
    const carrierAirUnits1 = taskForce1.AirUnits

    const taskForceOptions2: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 2,
      core: [soryu, shokaku, zuikaku],
      screen: [hiei, kirishima]
    }
    const taskForce2 = new TaskForce(taskForceOptions2)
    const carrierAirUnits2 = taskForce2.AirUnits

    const missionAirUnits = carrierAirUnits1.concat(carrierAirUnits2)
    expect(missionAirUnits.length).toBe(6)

    const airMissionOptions: AirMissionSchematicOptions = {
      airMissionType: AirMissionType.AirStrike,
      missionAirUnits: missionAirUnits,
      startHex: new Hex(3159),
      targetHex: new Hex(2860)
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
      hexLocation: 2860
    }
    oahuBase = new BaseUnit(options)

    const california = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB10')
    const nevada = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB1')
    const tennessee = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB11')
    const maryland = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB8')
    const oklahoma = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB3')
    const westvirginia = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB9')
    const arizona = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB4')
    const pennsylvania = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB2')

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
        pg15,
        pg18,
        bg5,
        bg11,
        pw1,
        pw2
      ],
      location: oahuHex
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
      targetHex: new Hex(2860)
    }
    airMission = new ES1AirMissionSchematic(airMissionOptions)

    const battleshipsAtTarget = force.NavalUnits.filter((unit) => unit.Id.startsWith('BB'))

    airStrikeTargets = airMission.allocateStrikeTargets(missionAirUnits, force.AirUnits, battleshipsAtTarget)
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
      navalTargets: ships
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
    const pg18 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '18th Pursuit Group')
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

  test('Anti-Air Strength Modification', async () => {

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
      targetHex: new Hex(2860)
    }
    airMission = new ES1AirMissionSchematic(airMissionOptions)
    const capUnit = cad5
    const drm = airMission.getAntiAirStrengthModifier(missionAirUnits, capUnit)
    expect(drm).toBe(8)

  })
  test('Resolve CAP vs Detected Air Strike Mission against Force', async () => {
    // set up Pearl Harbor base and air units
    oahuHex = new Hex(2860)
    pg18.Steps = 6

    expect (pg18.AAStrength).toBe(4)
    const forceOptions = {
      side: Side.Allied,
      forceId: 1,
      units: [oahuBase, pg15, pg18, bg5, bg11, pw1, pw2],
      location: oahuHex
    }

    const force = new Force(forceOptions)
    oahuHex.addForceToHex(force)

    // set up Japanese air units and air strike
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
      targetHex: oahuHex
    }
    airMission = new ES1AirMissionSchematic(airMissionOptions)
    const minLevel = airMission.getLowestStatusLevelOfMissionAirUnits()
    expect(minLevel).toBe(2)

    let coordinated = airMission.isCoordinated(4)
    expect(coordinated).toBe(true)

    // assume detected - alert air units up to value of base
    const base = force.BaseUnit
    expect(base?.Name).toBe('Oahu')
    expect(base?.LaunchCapacity).toBe(18)
    const defendingAirUnits = force.AirUnits

    expect(defendingAirUnits.length).toBe(6)

    // select highest value air unit -> suggestion maximum of anti-air value of F units
    // or just set one in this test?
    // get the highest aa strength of the Allied fighter units

    const capUnit = airMission.getCAPUnit()

    if (!capUnit) {
      throw Error('No CAP Unit found')
    }
    expect(capUnit.Id).toBe('18th Pursuit Group')
    expect(capUnit.AAStrength).toBe(4)

    const otherUnits = airMission.getOtherAirUnits(defendingAirUnits, capUnit)
    expect(otherUnits.length).toBe(5)

    const defendingDrm = airMission.getAntiAirStrengthModifier(defendingAirUnits, capUnit)
    expect(defendingDrm).toBe(0)

    // do the same for the attacking strike escort units
    const escortUnit = airMission.getEscortUnit(true)

    if (!escortUnit) {
      throw Error('No Escort Unit found')
    }
    expect(escortUnit.Id).toBe('CAD6')
    expect(escortUnit.AAStrength).toBe(7)

    const attackingDrm = airMission.getAntiAirStrengthModifier(missionAirUnits, escortUnit)
    expect(attackingDrm).toBe(8)

    // resolve air combat (simultaneous attacks)
    const airCombatOptions: AirCombatOptions = {
      coordinated: true,
      attackingUnits: missionAirUnits,
      defendingUnits: defendingAirUnits,
      capUnit: capUnit,
      escortUnit: escortUnit
    }

    const capvsEscortDieRoll = 0
    const escortvsCapDieRoll = 7
    const index = AirNavalCombatResultsTable.getIndexFor(4, 0)

    expect (index).toBe(5)

    const { hitsvsCap, hitsvsEscort } = airMission.capvsEscortAirUnits(airCombatOptions, capvsEscortDieRoll, escortvsCapDieRoll)
    expect(hitsvsEscort).toBe(2)
    expect(hitsvsCap).toBe(4)
  })
 
  test('Resolve CAP vs Detected Air Strike Mission against Task Force', async () => {
  })

  test('Resolve CAP vs Detected Air Strike Mission against multiple Task Forces', async () => {
  })

  test('Resolve CAP vs Detected Air Strike Mission against Task Force and Force in same hex', async () => {
  })
})


