import { Hex } from '../scenarios/Hex'
import { AbstractUnit, Type } from './AbstractUnit'
import { Side } from './Interfaces'

export enum BaseSize {
    Large = 'Large',
    Small = 'Small'
}

interface BaseUnitOptions {
  name: string
  type: Type
  side: Side
  id: string
  hits?: number
  aaStrength: number,
  launchCapacity: number,
  size: BaseSize
  hexLocation: number
}

export class BaseUnit extends AbstractUnit {
  private size: BaseSize
  private hex: Hex
  private launchCapacity: number

  constructor(options: BaseUnitOptions) {
    super(
      options.name,
      options.type,
      options.side,
      options.id,
      0,
      options.aaStrength,
      options.hits ? options.hits : 0
    )
    this.size = options.size
    this.hex = new Hex(options.hexLocation)
    this.launchCapacity = options.launchCapacity
  }
  public get Size(): BaseSize {
    return this.size
  }

  public get Hex() {
      return this.hex
  }

  public print(): string {
    return `${this.Id} SIZE ${this.size}`
  }
}
