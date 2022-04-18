import { FileRow } from '../dataload'
import { AbstractUnit } from './AbstractUnit'
import { AirUnit } from './AirUnit'
import { BaseUnit } from './BaseUnit'
import { Side, UnitType } from './Interfaces'
import { NavalUnit, SubmarineUnit } from './NavalUnit'

export class UnitMapper {
  private units: UnitType[] = new Array<UnitType>()
  private entityMap: Map<string, Function>
  private static _this: UnitMapper
  constructor() {
    this.entityMap = new Map([
      ['NAVAL', this.mapNavalUnit],
      ['AIR', this.mapAirUnit],
      ['BASE', this.mapBaseUnit],
      ['SUBMARINE', this.mapSubmarineUnit],
    ])
    UnitMapper._this = this
  }
  public map = (rows: FileRow[]) => {
    for (const row of rows) {
      const fn = this.entityMap.get(row.type)
      if (!fn) {
        const errorStr = `No Unit Map Function for Type: ${row.id} - ${row.name} - ${row.side}`
        throw Error(errorStr)
      }
      fn(row)
    }
  }

  public mapNavalUnit(row: FileRow) {
    const navalUnit = new NavalUnit({ ...row, hits: 0 })
    UnitMapper._this.units.push(navalUnit)
  }

  public mapAirUnit(row: FileRow) {
    const airUnit = new AirUnit({ ...row, hits: 0 })
    UnitMapper._this.units.push(airUnit)
  }

  public mapBaseUnit(row: FileRow) {
    const baseUnit = new BaseUnit({ ...row })
    UnitMapper._this.units.push(baseUnit)
  }

  public mapSubmarineUnit(row: FileRow) {
    const subUnit = new SubmarineUnit({  ...row, hits: 0 })
    UnitMapper._this.units.push(subUnit)
  }

  public getUnitById<T extends UnitType>(side: Side, id: string, ): T {
    const result = this.units
      .filter((unit) => unit.Side == side && unit.Id == id)

    if (result.length == 0) {
      throw new Error(
        `getUnitById: No results found for side ${side}, id ${id}`
      )
    }
    if (result.length > 1) {
      throw new Error(
        `getUnitById: Duplicate results found for side ${side}, id ${id} -> result: ` +
          result
      )
    }
    return result[0] as T
  }

  public getUnitsBySide(side: Side): AbstractUnit[] {
      return this.units.filter((unit) => unit.Side == side)
  }

  public get Units(): UnitType[] {
    return this.units
  }
}
