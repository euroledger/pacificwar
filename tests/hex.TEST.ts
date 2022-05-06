import { FileRow } from '../src/dataload'
import { Force } from '../src/forces/Force'
import { TaskForce, TaskForceOptions } from '../src/forces/TaskForce'
import { Main } from '../src/main'
import { ES1 } from '../src/scenarios/es1PearlHarbor/es1'
import { Hex } from '../src/map/Hex'
import { ActivationStatus, Side } from '../src/units/Interfaces'
import { NavalUnit } from '../src/units/NavalUnit'

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
  });

  test('Add 2 Japanese TFs to a Hex', async () => {
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
      screen: [kirishima, tone],
    }

    const taskForce1 = new TaskForce(taskForce1Options)
    expect(taskForce1.Core.length).toEqual(2)
    expect(taskForce1.Screen.length).toEqual(2)

    const taskForce2Options: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 2,
      core: [shokaku, zuikaku, hiei],
      screen: [kagero],
    }
    const taskForce2 = new TaskForce(taskForce2Options)
    expect(taskForce2.Core.length).toEqual(3)
    expect(taskForce2.Screen.length).toEqual(1)

    const japaneseTFHex = new Hex(3159)
    japaneseTFHex.addTaskForceToHex(taskForce1)
    japaneseTFHex.addTaskForceToHex(taskForce2)

    
  })
})
