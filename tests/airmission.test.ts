import { AirMissionSchematic, AirMissionSchematicOptions, AirMissionType } from "../src/airmissions/AirMissionSchematic";
import { FileRow } from "../src/dataload";
import { TaskForce, TaskForceOptions } from "../src/forces/TaskForce";
import { Main } from "../src/main";
import { ES1 } from "../src/scenarios/es1PearlHarbor/es1";
import { Hex } from "../src/scenarios/Hex";
import { AirUnit } from "../src/units/AirUnit";
import { Side } from "../src/units/Interfaces";
import { NavalUnit } from "../src/units/NavalUnit";

describe('Air Mission Schmatic', () => {
  let rows: FileRow[] | undefined
  const main = new Main(new ES1())

  beforeAll(async () => {
    await main.load()
    rows = main.Rows
    if (!rows) {
      throw Error('No rows were loaded')
    }
    main.mapRowsToUnits(rows) 
    main.setUpGame()  
  });
  test('Air Mission Preliminary Procedure', async () => {
    const scenario = main.Scenario as ES1

    // move this code into task force or scenario class
    let availableAirUnits: AirUnit[]
    const taskForces = scenario.TaskForces
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
      taskForceId: 1,
      core: [soryu, shokaku, zuikaku],
      screen: [hiei, kirishima],
    }
    const taskForce2 = new TaskForce(taskForceOptions1)
    const carrierAirUnits2 = taskForce1.AirUnits


    const missionAirUnits = carrierAirUnits1.concat(carrierAirUnits2)
    expect(missionAirUnits.length).toBe(6)

    const airMissionOptions: AirMissionSchematicOptions = {
      airMissionType: AirMissionType.AirStrike,
      missionAirUnits: missionAirUnits,
      startHex: new Hex(3159),
      targetHex: new Hex(2860),
    }   
    const airMission = new AirMissionSchematic(airMissionOptions)
    const minLevel = airMission.getLowestStatusLevelOfMissionAirUnits()
    expect(minLevel).toBe(2)

    let coordinated = airMission.isCoordinated(4)
    expect(coordinated).toBe(true)
    coordinated = airMission.isCoordinated(7)
    expect(coordinated).toBe(false)
    
  })
})
