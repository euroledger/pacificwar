import { AirMissionSchematicOptions, AirMissionType } from "../src/airmissions/AirMissionSchematic"
import { AirStrikeTarget } from "../src/airmissions/AirStrikeTarget"
import { FileRow } from "../src/dataload"
import { Force, ForceOptions } from "../src/forces/Force"
import { TaskForceOptions, TaskForce } from "../src/forces/TaskForce"
import { Main } from "../src/main"
import { Hex } from "../src/map/Hex"
import { ES1, ES1AirMissionSchematic } from "../src/scenarios/es1PearlHarbor/es1"
import { Type } from "../src/units/AbstractUnit"
import { AirUnit } from "../src/units/AirUnit"
import { BaseSize, BaseUnit } from "../src/units/BaseUnit"
import { Side } from "../src/units/Interfaces"
import { NavalUnit } from "../src/units/NavalUnit"

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


export const resetAirUnitHits = () => {
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
export const setUpJapanesAirStrike = () => {
  // set up Japanese air units and air strike

  missionAirUnits = [cad1, cad2, cad3, cad4, cad5, cad6]

  airMissionOptions = {
    airMissionType: AirMissionType.AirStrike,
    missionAirUnits: missionAirUnits,
    startHex: new Hex(3159),
    targetHex: oahuHex
  }
}
export const createJapaneseTaskForces = () => {
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
export const setUpOahuForce = () => {
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