import { FileRow } from "../src/dataload";
import { Main } from "../src/main";
import { ES1 } from "../src/scenarios/es1PearlHarbor/es1";
import { AirUnit } from "../src/units/AirUnit";

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
    for (const tf of taskForces) {
      // get carriers from each task force
     
      // for each carrier get air unit -> add to availableAirUnits

      // const shokaku = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
      // const shokakuCAG = main.Mapper.getUnitById<AirUnit>(Side.Japan, shokaku.AirGroup)
    }
   
  })
})
