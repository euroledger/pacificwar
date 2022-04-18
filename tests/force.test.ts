import { FileRow } from '../src/dataload'
import { Force } from '../src/forces/Force'
import { TaskForce, TaskForceOptions } from '../src/forces/TaskForce'
import { Main } from '../src/main'
import { ES1 } from '../src/scenarios/es1PearlHarbor/es1'
import { Hex } from '../src/scenarios/Hex'
import { Type } from '../src/units/AbstractUnit'
import { BaseSize, BaseUnit } from '../src/units/BaseUnit'
import { ActivationStatus, Side } from '../src/units/Interfaces'
import { NavalUnit } from '../src/units/NavalUnit'

const main = new Main(new ES1())
describe('Create Task Force', () => {
  let rows: FileRow[] | undefined

  beforeAll(async () => {
    await main.load()
    rows = main.Rows
    if (!rows) {
      throw Error('No rows were loaded')
    }
    main.mapRowsToUnits(rows) // can we move this to beforeAll()
    main.setUpGame()  
  });

  test('Create a Japanese Task Force', async () => {
    const shokaku = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
    const kaga = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    const tone = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CA9')
    const kagero = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'DD9')
    const hiei = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB8')
    const kirishima = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB9')

    const taskForceOptions: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [shokaku, kaga, hiei],
      screen: [kirishima, tone, kagero],
    }

    const taskForce = new TaskForce(taskForceOptions)
    expect(taskForce.Core.length).toEqual(3)
    expect(taskForce.Screen.length).toEqual(3)
    expect(kirishima.ActivationStatus).toBe(ActivationStatus.Activated)
  })

  test('Create an Allied Task Force', async () => {
    // create an Allied Task Force with 2 x BB in core; 1 x CA and 1 x DD in screen
    const mahan = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD5')
    const nevada = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB1')
    const tennessee = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB11')
    const neworleans = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CA6')

    const taskForceOptions: TaskForceOptions = {
      side: Side.Allied,
      taskForceId: 1,
      core: [tennessee, nevada],
      screen: [mahan, neworleans],
    }

    const taskForce = new TaskForce(taskForceOptions)
    expect(taskForce.Core.length).toEqual(2)
    expect(taskForce.Screen.length).toEqual(2)
    expect(nevada.ActivationStatus).toBe(ActivationStatus.Unactivated)

  })
  test('Try to create an illegal Task Force', async () => {
    // try to create a task force with:
    // a) a CV in the screen
    // b) a CA in the core
    // c) unloaded DD in the core
    // e) too many units in core (< num in screen)
    // f) too many capital ships (>6) in TF
    // g) too many non-capital ships (>4) in TF
    // h) add a ship to the TF that is already there

    const shokaku = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
    const kaga = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    const tone = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CA9')
    const kagero = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'DD9')
    const hiei = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB8')
    const kirishima = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB9')
    const akagi = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV1')
    const hiryu = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV3')
    const zuikaku = main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV6')


    const taskForceOptions: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [shokaku, hiei],
      screen: [kaga],
    }
    expect(() => {
      new TaskForce(taskForceOptions)
    }).toThrowError('Unit CV2 cannot be in screen')

    const taskForceOptions2: TaskForceOptions = {
      side: Side.Japan,
      taskForceId: 1,
      core: [shokaku, tone],
      screen: [kaga],
    }
    expect(() => {
      new TaskForce(taskForceOptions2)
    }).toThrowError('Unit CA9 cannot be in core')

    const taskForceOptions3: TaskForceOptions = {
        side: Side.Japan,
        taskForceId: 1,
        core: [shokaku, kagero],
        screen: [kaga],
      }
      expect(() => {
        new TaskForce(taskForceOptions3)
      }).toThrowError('Unit DD9 cannot be in core')

      const taskForceOptions5: TaskForceOptions = {
        side: Side.Japan,
        taskForceId: 1,
        core: [hiei],
        screen: [kagero, tone],
      }
      expect(() => {
        new TaskForce(taskForceOptions5)
      }).toThrowError('Cannot add unit CA9 to screen - would make screen size bigger than core size')

      
      const taskForceOptions6: TaskForceOptions = {
        side: Side.Japan,
        taskForceId: 1,
        core: [hiryu, akagi, kaga, shokaku, zuikaku],
        screen: [kirishima, hiei],
      }
      expect(() => {
        new TaskForce(taskForceOptions6)
      }).toThrowError('Cannot add unit BB8 to TF: capital ship limit (6) reached')

      const nevada = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB1')
      const tennessee = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB11')
      const california = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB10')
      const maryland = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB8')
      const oklahoma = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB3')
      const brooklyn1 = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CL3')
      const brooklyn2 = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CL4')
      const omaha = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CL2')
      const mahan = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD5')
      const farragut = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD3')
      
      const taskForceOptions7: TaskForceOptions = {
        side: Side.Allied,
        taskForceId: 1,
        core: [nevada, tennessee, california, maryland, oklahoma],
        screen: [brooklyn1, brooklyn2, omaha, mahan, farragut],
      }
      expect(() => {
        new TaskForce(taskForceOptions7)
      }).toThrowError('Cannot add unit DD3 to TF: Non-capital ship limit (4) reached')

      const taskForceOptions8: TaskForceOptions = {
        side: Side.Allied,
        taskForceId: 1,
        core: [nevada, tennessee, california, maryland, oklahoma],
        screen: [brooklyn1, brooklyn2, omaha, mahan, california],
      }
      expect(() => {
        new TaskForce(taskForceOptions8)
      }).toThrowError('Unit BB10 already exists in the task force')

      const taskForceOptions9: TaskForceOptions = {
        side: Side.Allied,
        taskForceId: 1,
        core: [nevada, tennessee, maryland, oklahoma],
        screen: [brooklyn1, brooklyn2, omaha, mahan],
      }
      const taskForce = new TaskForce(taskForceOptions9)

      expect(() => {
        taskForce.removeUnitFromCoreById(maryland.Id)
      }).toThrowError('Cannot remove Unit BB8 as core would contain less units than screen')

      taskForce.removeUnitFromScreenById(brooklyn2.Id)
      expect(taskForce.Screen.length).toBe(3)
  })

  test('Create an Allied Force', async () => {
    // Create an Allied Force with all Scenario 1 units in a large base in Oahu
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
    const mahan = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD5')
    const nevada = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB1')
    const tennessee = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB11')
    const neworleans = main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'CA6')

    const oahuHex = new Hex(2860)

    const forceOptions = {
      side: Side.Allied,
      forceId: 1,
      units: [oahuBase, mahan, nevada, tennessee, neworleans],
      location: oahuHex
    }

    const force = new Force(forceOptions)
    expect(force.getActivatedUnits.length).toBe(0)
    expect(force.getDeactivatedUnits.length).toBe(0)
    expect(force.getUnactivatedUnits.length).toBe(0)

    expect(() => {
      force.removeUnitFromForceById('BB8')
    }).toThrowError('Unit BB8 not found in Force 1')

    force.removeUnitFromForceById(mahan.Id)
    expect(force.Units.length).toBe(4)
  })
})
