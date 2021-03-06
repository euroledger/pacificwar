import { FileRow } from '../src/dataload'
import { Main } from '../src/main'
import { ES1 } from '../src/scenarios/es1PearlHarbor/es1'
import { BaseSize } from '../src/units/AbstractUnit'
import { AirUnit } from '../src/units/AirUnit'
import { BaseUnit } from '../src/units/BaseUnit'
import { ActivationStatus, AircraftType, Side } from '../src/units/Interfaces'
import { NavalUnit, NavalUnitType, SubmarineUnit } from '../src/units/NavalUnit'


describe('CSV Load Service Pearl Harbor', () => {
  const main = new Main(new ES1())
  let rows: FileRow[] | undefined

  test('Load all rows for Engagement Scenario 1: Pearl Harbor', async () => {
    await main.load()
    rows = main.Rows
    expect(rows?.length).toBe(43)
  })

  test('Initialise all units for Engagement Scenario 1: Pearl Harbor', async () => {
    if (!rows) {
      throw Error('No rows were loaded')
    }
    main.mapRowsToUnits(rows)
    const allUnits = Main.Mapper.Units
    expect(allUnits.length).toBe(43)
  })

  test('Japanese Aircraft Carrier Kaga has correct unit values', async () => {
    const kaga = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    expect(kaga.Name).toBe('Kaga')
    expect(kaga.LaunchCapacity).toBe(5)
    expect(kaga.isCapitalShip()).toBe(true)
    expect(kaga.AAStrength).toBe(2)
    expect(kaga.LaunchCapacity).toBe(5)
    expect(kaga.HitCapacity).toBe(5)
    expect(kaga.CanBeCrippled).toBe(true)
    expect(kaga.ShortGunnery).toBe(-1)
    expect(kaga.MediumGunnery).toBe(-1)
    expect(kaga.LongGunnery).toBe(-1)
    expect(kaga.ASW).toBe(1)
    expect(kaga.AirGroup).toBe('CAD2')
    expect(kaga.isCarrier()).toBe(true)
    expect(kaga.hasSpotterPlane()).toBe(false)
    expect(kaga.isNavalUnit()).toBe(true)
    expect(kaga.NavalUnitType).toBe(NavalUnitType.AircraftCarrier)
  })

  test('Japanese Battleship Hiei has correct unit values', async () => {
    const hiei = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'BB8')
    expect(hiei.isCapitalShip()).toBe(true)
    expect(hiei.LaunchCapacity).toBe(NaN)
    expect(hiei.AAStrength).toBe(2)
    expect(hiei.HitCapacity).toBe(5)
    expect(hiei.CanBeCrippled).toBe(true)
    expect(hiei.ShortGunnery).toBe(6)
    expect(hiei.MediumGunnery).toBe(2)
    expect(hiei.LongGunnery).toBe(1)
    expect(hiei.AirGroup).toBe('')
    expect(hiei.BombardStrength).toBe(4)
    expect(hiei.isCarrier()).toBe(false)
    expect(hiei.hasSpotterPlane()).toBe(true)
    expect(hiei.NavalUnitType).toBe(NavalUnitType.Battleship)
    expect(hiei.ActivationStatus).toBe(ActivationStatus.Unactivated) 
  })

  test('US Battleship Arizona has correct unit values', async () => {
    const arizona = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'BB4')
    expect(arizona.isCapitalShip()).toBe(true)
    expect(arizona.LaunchCapacity).toBe(NaN)
    expect(arizona.AAStrength).toBe(1)
    expect(arizona.HitCapacity).toBe(6)
    expect(arizona.CanBeCrippled).toBe(true)
    expect(arizona.ShortGunnery).toBe(7)
    expect(arizona.MediumGunnery).toBe(3)
    expect(arizona.LongGunnery).toBe(1)
    expect(arizona.BombardStrength).toBe(6)
    expect(arizona.AirGroup).toBe('')
    expect(arizona.isCarrier()).toBe(false)
    expect(arizona.NavalUnitType).toBe(NavalUnitType.Battleship)
    expect(arizona.hasSpotterPlane()).toBe(true)
    expect(arizona.isNavalUnit()).toBe(true)
  })

  test('US Destroyer Squadron Mahan has correct unit values', async () => {
    const mahan = Main.Mapper.getUnitById<NavalUnit>(Side.Allied, 'DD5')
    expect(mahan.isCapitalShip()).toBe(false)
    expect(mahan.LaunchCapacity).toBe(NaN)
    expect(mahan.AAStrength).toBe(2)
    expect(mahan.HitCapacity).toBe(6)
    expect(mahan.Crippled).toBe(false)
    expect(mahan.ShortGunnery).toBe(2)
    expect(mahan.MediumGunnery).toBe(0)
    expect(mahan.LongGunnery).toBe(0.5)
    expect(mahan.BombardStrength).toBe(2)
    expect(mahan.NavalUnitType).toBe(NavalUnitType.Destroyer)    
    expect(mahan.isCarrier()).toBe(false)
    expect(mahan.hasSpotterPlane()).toBe(false)
    expect(mahan.isNavalUnit()).toBe(true)

  })

  test('US 2nd MAW has correct unit values', async () => {
    const maw = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd MAW')
    expect(maw.Range).toBe(8)
    expect(maw.AAStrength).toBe(4)
    expect(maw.AntiNavalStrength).toBe(0)
    expect(maw.AntiGroundStrength).toBe(2)
    expect(maw.AircraftType).toBe(AircraftType.F)
    expect(maw.AircraftLevel).toBe(1)
    expect(maw.ReverseAA).toBe(6)
    expect(maw.Steps).toBe(4)
    expect(maw.isNavalUnit()).toBe(false)
  })

  test('US 5th Bomber Group has correct unit values', async () => {
    const bg5 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '5th Bomber Group')
    expect(bg5.AAStrength).toBe(-1)
    expect(bg5.Range).toBe(26)
    expect(bg5.AntiNavalStrength).toBe(-1)
    expect(bg5.AntiGroundStrength).toBe(0)
    expect(bg5.AircraftType).toBe(AircraftType.B)
    expect(bg5.AircraftLevel).toBe(0)
    expect(bg5.ReverseAA).toBe(0)
    expect(bg5.Steps).toBe(1)
  })

  
  test('US 18th and 15th Pursuit Group have correct AA unit values', async () => {
    const pg18 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '18th Pursuit Group')
    expect(pg18.AAStrength).toBe(4)
  
    const pg15 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '15th Pursuit Group')
    expect(pg15.AAStrength).toBe(3)
  })

  test('US 2nd Patrol Wing has correct unit values', async () => {
    const pw2 = Main.Mapper.getUnitById<AirUnit>(Side.Allied, '2nd Patrol Wing')
    expect(pw2.AAStrength).toBe(NaN)
    expect(pw2.Range).toBe(16)
    expect(pw2.AircraftType).toBe(AircraftType.LRA)
    expect(pw2.Steps).toBe(1)
    expect(pw2.AircraftLevel).toBe(NaN)
    expect(pw2.ReverseAA).toBe(NaN)
    expect(pw2.AntiNavalStrength).toBe(NaN)
    expect(pw2.AntiGroundStrength).toBe(NaN)
    expect(pw2.isNavalUnit()).toBe(false)
  })

  test('Japanese Aircraft Carrier Shokaku Carrier Air Group has correct unit values', async () => {
    const shokaku = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV5')
    expect(shokaku.Name).toBe('Shokaku')
    const shokakuCAG = Main.Mapper.getUnitById<AirUnit>(Side.Japan, shokaku.AirGroup)
    expect(shokakuCAG.AAStrength).toBe(7)
    expect(shokakuCAG.Range).toBe(8)
    expect(shokakuCAG.AntiNavalStrength).toBe(8)
    expect(shokakuCAG.AntiGroundStrength).toBe(6)
    expect(shokakuCAG.AircraftType).toBe(AircraftType.F)
    expect(shokakuCAG.AircraftLevel).toBe(2)
    expect(shokakuCAG.ReverseAA).toBe(7)
    expect(shokakuCAG.Steps).toBe(6)
    expect(shokakuCAG.Hits).toBe(0)
  })

  test('Japanese Aircraft Carrier Kaga Carrier Air Group has correct unit values', async () => {
    const kaga = Main.Mapper.getUnitById<NavalUnit>(Side.Japan, 'CV2')
    expect(kaga.Name).toBe('Kaga')
    const kagaCAG = Main.Mapper.getUnitById<AirUnit>(Side.Japan, kaga.AirGroup)
    expect(kagaCAG.AAStrength).toBe(6)
    expect(kagaCAG.Range).toBe(8)
    expect(kagaCAG.AntiNavalStrength).toBe(7)
    expect(kagaCAG.AntiGroundStrength).toBe(5)
    expect(kagaCAG.AircraftType).toBe(AircraftType.F)
    expect(kagaCAG.AircraftLevel).toBe(2)
    expect(kagaCAG.ReverseAA).toBe(7)
    expect(kagaCAG.Steps).toBe(5)
    expect(kagaCAG.Hits).toBe(1)
  })

  test('Pearl Harbor Base Unit has correct values', async () => {
    const ph = Main.Mapper.getUnitById<BaseUnit>(Side.Allied, 'Pearl Harbor Base')
    expect(ph.AAStrength).toBe(4)
    expect(ph.Size).toBe(BaseSize.Large)
    expect(ph.Hex.HexNumber).toBe(2860)
  })

  test('US Submarine Unit has correct values', async () => {
    const sub = Main.Mapper.getUnitById<SubmarineUnit>(Side.Allied, 'SubUnit')
    expect(sub.Steps).toBe(36)
  })
})
