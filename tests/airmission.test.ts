import { AirCombatOptions, AirMissionSchematicOptions, AirMissionType } from '../src/airmissions/AirMissionSchematic'
import { AirStrikeTarget, AirStrikeTargetOptions } from '../src/airmissions/AirStrikeTarget'
import { FileRow } from '../src/dataload'
import { Force, ForceOptions } from '../src/forces/Force'
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

  const resetAirUnitHits = () => {
    maw2.Hits = 2
    pg18.Hits = 0
    pg15.Hits = 1
    bg11.Hits = 3
    bg5.Hits = 5
    maw2.HitsThisMission = 0
    pg18.HitsThisMission = 0
    pg15.HitsThisMission = 0
    bg11.HitsThisMission = 0
    bg5.HitsThisMission = 0
    maw2.Eliminated = false
    pg18.Eliminated = false
    pg15.Eliminated = false
    bg11.Eliminated = false
    bg5.Eliminated = false

    cad1.Hits = 1
    cad2.Hits = 1
    cad3.Hits = 2
    cad4.Hits = 2
    cad5.Hits = 0
    cad6.Hits = 0
    cad1.HitsThisMission = 0
    cad2.HitsThisMission = 0
    cad3.HitsThisMission = 0
    cad4.HitsThisMission = 0
    cad5.HitsThisMission = 0
    cad6.HitsThisMission = 0

    cad1.Eliminated = false
    cad2.Eliminated = false
    cad3.Eliminated = false
    cad4.Eliminated = false
    cad5.Eliminated = false
    cad6.Eliminated = false

    cad1.Aborted = false
    cad2.Aborted = false
    cad3.Aborted = false
    cad4.Aborted = false
    cad5.Aborted = false
    cad6.Aborted = false
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
  }
  const createJapaneseTaskForces = () => {
    taskForceOptions1 = {
      side: Side.Japan,
      taskForceId: 1,
      core: [akagi, kaga, hiryu],
      screen: [tone, kagero]
    }
    taskForce1 = new TaskForce(taskForceOptions1)

    taskForceOptions2 = {
      side: Side.Japan,
      taskForceId: 2,
      core: [soryu, shokaku, zuikaku],
      screen: [hiei, kirishima]
    }
    taskForce2 = new TaskForce(taskForceOptions2)
    hex.addTaskForceToHex(taskForce1)
    hex.addTaskForceToHex(taskForce2)
  }

  const setUpOahuForce = () => {
    california = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB10')
    nevada = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB1')
    tennessee = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB11')
    maryland = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB8')
    oklahoma = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB3')
    westvirginia = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB9')
    arizona = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB4')
    pennsylvania = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB2')

    pg18 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '18th Pursuit Group')
    pg15 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '15th Pursuit Group')
    bg11 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '11th Bomber Group')
    bg5 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '5th Bomber Group')
    pw1 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '1st Patrol Wing')
    pw2 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd Patrol Wing')

    pg18.Steps = 6
    pg18.Hits = 0

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

    force = new Force(forceOptions)
    oahuHex.addForceToHex(force)
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
  describe('Air Mission', () => {
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
      setUpOahuForce()

      const missionAirUnits = [cad1, cad2, cad3, cad4, cad5, cad6]

      const airMissionOptions: AirMissionSchematicOptions = {
        airMissionType: AirMissionType.AirStrike,
        missionAirUnits: missionAirUnits,
        startHex: new Hex(3159),
        targetHex: new Hex(2860)
      }
      airMission = new ES1AirMissionSchematic(airMissionOptions)

      const battleshipsAtTarget = force.NavalUnits.filter((unit) => unit.Id.startsWith('BB'))

      airStrikeTargets = airMission.allocateStrikeTargetsBattleCycle1(missionAirUnits, force.AirUnits, battleshipsAtTarget)
      expect(airStrikeTargets.length).toBe(6)
    })

    test('Resolve Air Strike vs Naval Unit', async () => {
      california = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB10')
      california.Hits = 0

      const ships = [california]

      const options: AirStrikeTargetOptions = {
        attacker: cad1,
        combatType: AirNavalCombatType.FAirvsNaval,
        navalTargets: ships
      }
      const airStrike = new AirStrikeTarget(options)
      const airMissionOptions: AirMissionSchematicOptions = {
        airMissionType: AirMissionType.AirStrike,
        missionAirUnits: missionAirUnits,
        startHex: new Hex(3159),
        targetHex: new Hex(2860)
      }
      airMission = new ES1AirMissionSchematic(airMissionOptions)
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

      const options: AirStrikeTargetOptions = {
        attacker: cad1,
        combatType: AirNavalCombatType.AirvsUnalertedAir,
        airTarget: pg18
      }
      const airStrike = new AirStrikeTarget(options)

      const airMissionOptions: AirMissionSchematicOptions = {
        airMissionType: AirMissionType.AirStrike,
        missionAirUnits: missionAirUnits,
        startHex: new Hex(3159),
        targetHex: new Hex(2860)
      }
      airMission = new ES1AirMissionSchematic(airMissionOptions)

      airMission.FirstAttack = false
      airMission.resolveStrafevsUnalertedAir(airStrike, 1)

      expect(pg18.Hits).toBe(6)
      expect(pg18.Steps).toBe(0)
      expect(pg18.Eliminated).toBe(true)

      resetAirUnitHits()
    })
  })
  describe('Air-to-Air Combat', () => {
    test('Japanese Anti-Air Strength Modification', async () => {
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

    test('US Anti-Air Strength Modification', async () => {
      const defendingAirUnits = [maw2, pg18, pg15, bg11, bg5]
      const airMissionOptions: AirMissionSchematicOptions = {
        airMissionType: AirMissionType.AirStrike,
        missionAirUnits: [], // not needed in this test
        startHex: new Hex(3159),
        targetHex: new Hex(2860)
      }
      airMission = new ES1AirMissionSchematic(airMissionOptions)
      const escortUnit = maw2
      const drm = airMission.getAntiAirStrengthModifier(defendingAirUnits, escortUnit)

      expect(drm).toBe(0)
    })

    test('Resolve CAP vs Detected Air Strike Mission against Force', async () => {
      // set up Pearl Harbor base and air units
      setUpOahuForce()
      setUpJapanesAirStrike()

      const airMission = new ES1AirMissionSchematic(airMissionOptions)
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

      const { hitsvsCap, hitsvsEscort } = airMission.capvsEscortAirUnits(
        airCombatOptions,
        capvsEscortDieRoll,
        escortvsCapDieRoll
      )
      expect(hitsvsEscort).toBe(2)
      expect(hitsvsCap).toBe(4)
    })

    test('Allocate Hits amongst Mission Units', () => {
      // set up Pearl Harbor base and air units
      setUpOahuForce()
      setUpJapanesAirStrike()

      const airMission = new ES1AirMissionSchematic(airMissionOptions)
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

      // do the same for the attacking strike escort units
      const escortUnit = airMission.getEscortUnit(true)

      if (!escortUnit) {
        throw Error('No Escort Unit found')
      }

      // resolve air combat (simultaneous attacks)
      const airCombatOptions: AirCombatOptions = {
        coordinated: true,
        attackingUnits: missionAirUnits,
        defendingUnits: defendingAirUnits,
        capUnit: capUnit,
        escortUnit: escortUnit
      }

      airMission.allocateAirCombatHits({ hitsvsEscort: 9, hitsvsCap: 3 }, airCombatOptions)

      expect(escortUnit.Id).toBe('CAD6')
      expect(escortUnit.Steps).toBe(4)
      expect(escortUnit.HitsThisMission).toBe(2)
      expect(escortUnit.Aborted).toBe(true)
      expect(cad5.Steps).toBe(4)
      expect(cad5.HitsThisMission).toBe(2)
      expect(cad5.Aborted).toBe(true)
      expect(cad1.Steps).toBe(3)
      expect(cad1.Aborted).toBe(true)
      expect(cad2.Steps).toBe(3)
      expect(cad2.Aborted).toBe(true)
      expect(cad3.Steps).toBe(3)
      expect(cad3.HitsThisMission).toBe(1)
      expect(cad3.Aborted).toBe(false)
      expect(cad4.Steps).toBe(4)
      expect(cad4.HitsThisMission).toBe(0)
      expect(cad4.Aborted).toBe(false)

      resetAirUnitHits()
      airMission.allocateAirCombatHits({ hitsvsEscort: 26, hitsvsCap: 0 }, airCombatOptions)
      expect(escortUnit.Steps).toBe(0)
      expect(escortUnit.Eliminated).toBe(true)
      expect(cad5.Steps).toBe(2)
      expect(cad5.Aborted).toBe(true)
      expect(cad1.Steps).toBe(1)
      expect(cad1.Aborted).toBe(true)
      expect(cad2.Steps).toBe(1)
      expect(cad2.Aborted).toBe(true)
      expect(cad3.Steps).toBe(0)
      expect(cad3.Aborted).toBe(true)
      expect(cad4.Steps).toBe(0)
      expect(cad4.Aborted).toBe(true)

      resetAirUnitHits()
      airMission.allocateAirCombatHits({ hitsvsEscort: 36, hitsvsCap: 0 }, airCombatOptions)
      expect(escortUnit.Steps).toBe(0)
      expect(escortUnit.Eliminated).toBe(true)
      expect(cad5.Steps).toBe(0)
      expect(cad5.Eliminated).toBe(true)
      expect(cad1.Steps).toBe(0)
      expect(cad1.Eliminated).toBe(true)
      expect(cad2.Steps).toBe(0)
      expect(cad2.Eliminated).toBe(true)
      expect(cad3.Steps).toBe(0)
      expect(cad3.Eliminated).toBe(true)
      expect(cad4.Steps).toBe(0)
      expect(cad4.Eliminated).toBe(true)
    })

    test('Allocate Hits amongst CAP Units', () => {
      setUpJapanesAirStrike()

      pg18 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '18th Pursuit Group')
      maw2 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd MAW')
      oahuHex = new Hex(2860)
      resetAirUnitHits()

      const forceOptions = {
        side: Side.Allied,
        forceId: 1,
        units: [oahuBase, pg18, maw2],
        location: oahuHex
      }

      force = new Force(forceOptions)
      oahuHex.addForceToHex(force)
      const airMissionOptions: AirMissionSchematicOptions = {
        airMissionType: AirMissionType.AirStrike,
        missionAirUnits: missionAirUnits,
        startHex: hex,
        targetHex: oahuHex
      }
      const airMission = new ES1AirMissionSchematic(airMissionOptions)

      const defendingAirUnits = force.AirUnits
      expect(defendingAirUnits.length).toBe(2)

      // select highest value air unit -> suggestion maximum of anti-air value of F units
      // or just set one in this test?
      // get the highest aa strength of the Allied fighter units

      const capUnit = airMission.getCAPUnit()

      if (!capUnit) {
        throw Error('No CAP Unit found')
      }
      expect(capUnit.Id).toBe('2nd MAW')
      // resolve air combat (simultaneous attacks)
      const airCombatOptions: AirCombatOptions = {
        coordinated: true,
        attackingUnits: missionAirUnits,
        defendingUnits: defendingAirUnits,
        capUnit: capUnit,
        escortUnit: undefined
      }

      resetAirUnitHits()

      airMission.allocateAirCombatHits({ hitsvsEscort: 0, hitsvsCap: 1 }, airCombatOptions)
      expect(maw2.Hits).toBe(3)
      expect(maw2.Steps).toBe(3)
      expect(pg18.Hits).toBe(0)
      expect(pg18.Steps).toBe(6)

      resetAirUnitHits()

      airMission.allocateAirCombatHits({ hitsvsEscort: 0, hitsvsCap: 5 }, airCombatOptions)
      expect(maw2.Hits).toBe(5) // starts with 2 hits
      expect(maw2.Steps).toBe(1)
      expect(pg18.Hits).toBe(2)
      expect(pg18.Steps).toBe(4)

      // test situation where insufficient steps to allocate all hits
      resetAirUnitHits()

      airMission.allocateAirCombatHits({ hitsvsEscort: 0, hitsvsCap: 20 }, airCombatOptions)
      expect(maw2.Hits).toBe(6)
      expect(maw2.Steps).toBe(0)
      expect(pg18.Hits).toBe(6)
      expect(pg18.Steps).toBe(0)
    })

    test('Resolve CAP vs Detected Air Strike Mission against multiple Task Forces', async () => {
      createJapaneseTaskForces()
      resetAirUnitHits()

      const missionAirUnits = [pg18, pg15, bg11, bg5]

      const airMissionOptions: AirMissionSchematicOptions = {
        airMissionType: AirMissionType.AirStrike,
        missionAirUnits: missionAirUnits,
        startHex: oahuHex,
        targetHex: hex
      }
      const airMission = new ES1AirMissionSchematic(airMissionOptions)
      // get all air units from defending TFs (we assume the air strike was detected)
      const capAirUnits = hex.CapAirUnits
      expect(capAirUnits.length).toBe(6)

      let coordinated = airMission.isCoordinated(0)
      expect(coordinated).toBe(true)

      const minLevel = airMission.getLowestStatusLevelOfMissionAirUnits()
      expect(minLevel).toBe(0)

      const defendingAirUnits = hex.CapAirUnits

      const capUnit = airMission.getCAPUnit()

      if (!capUnit) {
        throw Error('No CAP Unit found')
      }
      expect(capUnit.Id).toBe('CAD6')
      expect(capUnit.AAStrength).toBe(7)

      // do the same for the attacking strike escort units
      const escortUnit = airMission.getEscortUnit(true)
      if (!escortUnit) {
        throw Error('No CAP Unit found')
      }
      expect(escortUnit.Id).toBe('18th Pursuit Group')
      expect(escortUnit.AAStrength).toBe(4)

      const airCombatOptions: AirCombatOptions = {
        coordinated: true,
        attackingUnits: missionAirUnits,
        defendingUnits: defendingAirUnits,
        capUnit: capUnit,
        escortUnit: escortUnit
      }

      const capvsEscortDieRoll = 9
      const escortvsCapDieRoll = 0

      const { hitsvsCap, hitsvsEscort } = airMission.capvsEscortAirUnits(
        airCombatOptions,
        capvsEscortDieRoll,
        escortvsCapDieRoll
      )
      expect(hitsvsEscort).toBe(3)
      expect(hitsvsCap).toBe(2)
    })

    test('Resolve CAP vs Detected Air Strike Mission against Task Force and Force in same hex', async () => {})
  })
  describe('Flak', () => {
    test('Resolve Flak vs (Detected) Air Strike against Force', async () => {
      setUpOahuForce()
      setUpJapanesAirStrike()

      const airMission = new ES1AirMissionSchematic(airMissionOptions)

      // do the same for the attacking strike escort units
      const escortUnit = airMission.getEscortUnit(true)

      if (!escortUnit) {
        throw Error('No Escort Unit found')
      }

      // assume escort unit is aborted following air combat
      escortUnit.Aborted = true

      // 1. Which units can fire: this will be air strike against base including non-activated naval units
      // All ground units + 4 naval units + Base can conduct flak
      const flakUnits = airMission.determineFlakUnits()

      expect(flakUnits.length).toBe(5) // 4 naval units + baseUnit

      // 2. Determine Anti-Strength of above units
      const flakStrength = airMission.calculateFlakStrength(flakUnits)
      expect(flakStrength).toBe(10)

      // 3. Use normal flak line of combat results table
      const result = await airMission.getFlakHits(flakStrength, 6)
      expect(result.hits).toBe(1)
    })

    test('Resolve Flak Hits', async () => {
      setUpJapanesAirStrike()

      const airMission = new ES1AirMissionSchematic(airMissionOptions)

      // do the same for the attacking strike escort units
      const escortUnit = airMission.getEscortUnit(true)

      if (!escortUnit) {
        throw Error('No Escort Unit found')
      }
      expect(escortUnit.Id).toBe('CAD6')

      // assume escort unit is aborted following air combat
      escortUnit.Hits = 2
      escortUnit.HitsThisMission = 2
      escortUnit.Aborted = true

      // assume one of the other mission air units suffered one hit from air combat
      cad5.Hits = 1
      cad5.HitsThisMission = 1

      const airCombatOptions: AirCombatOptions = {
        coordinated: true,
        attackingUnits: missionAirUnits,
        defendingUnits: [],
        capUnit: undefined,
        escortUnit: escortUnit
      }
      airMission.allocateFlakHits(1, airCombatOptions)
      expect(cad6.Hits).toBe(2)
      expect(cad6.HitsThisMission).toBe(2)
      expect(cad6.Aborted).toBe(true)

      expect(cad5.Hits).toBe(2)
      expect(cad5.HitsThisMission).toBe(2)
      expect(cad5.Aborted).toBe(true)

      resetAirUnitHits()
      escortUnit.Hits = 2
      escortUnit.HitsThisMission = 2
      escortUnit.Aborted = true

      // assume one of the other mission air units suffered one hit from air combat
      cad5.Hits = 1
      cad5.HitsThisMission = 1
      airMission.allocateFlakHits(7, airCombatOptions)

      // 1 hit to CAD5, 2 each to CAD1, CAD2, CAD3
      expect(cad5.Hits).toBe(2)
      expect(cad5.HitsThisMission).toBe(2)
      expect(cad5.Aborted).toBe(true)

      expect(cad1.Hits).toBe(3) // starts scenario with 1 hit
      expect(cad1.HitsThisMission).toBe(2)
      expect(cad1.Aborted).toBe(true)

      expect(cad2.Hits).toBe(3)
      expect(cad2.HitsThisMission).toBe(2)
      expect(cad2.Aborted).toBe(true)

      expect(cad3.Hits).toBe(4) // starts scenario with 2 hits
      expect(cad3.HitsThisMission).toBe(2)
      expect(cad3.Aborted).toBe(true)

      expect(cad4.Hits).toBe(2) // starts scenario with 2 hits
      expect(cad4.HitsThisMission).toBe(0)
      expect(cad4.Aborted).toBe(false)
    })

    test('Resolve Flak vs Air Strike against Task Forces', async () => {
      // US strike against Japanese TFs. Assume no air units took any hits in air combat vs CAP
    })
  })
})
