import { AbstractUnit, Type } from './AbstractUnit'
import { AircraftType, Side } from './Interfaces'

// export enum AircraftType {
//   F = 'F',
//   T = 'T', 
//   B = 'B', 
//   LRA = 'LRA'
// }

interface AirUnitOptions {
  name: string
  type: Type
  side: Side
  id: string
  apCost: number
  hits: number
  aaStrength: number
  range: number
  anStrength: number
  agStrength: number
  aircraftType: string
  aircraftLevel: number
  reverseAA: number
  steps: number
}

export class AirUnit extends AbstractUnit {
  private range!: number
  private anStrength!: number
  private agStrength!: number
  private aircraftType!: AircraftType
  private aircraftLevel!: number
  private reverseAA!: number
  private steps!: number

  constructor(options: AirUnitOptions) {
    super(
      options.name,
      options.type,
      options.side,
      options.id,
      options.apCost,
      options.aaStrength,
      options.hits
    )
    this.range = options.range
    this.anStrength = options.anStrength
    this.agStrength = options.agStrength
    this.aircraftType = options.aircraftType as AircraftType
    this.aircraftLevel = options.aircraftLevel
    this.reverseAA = options.reverseAA
    this.steps = options.steps
  }

  public get Range() {
    return this.range
  }

  public get AntiNavalStrength(): number {
    return this.anStrength
  }

  public get AntiGroundStrength(): number {
    return this.agStrength
  }

  public get AircraftType(): string {
    return this.aircraftType
  }

  public get AircraftLevel(): number {
    return this.aircraftLevel
  }

  public get ReverseAA(): number {
    return this.reverseAA
  }
  public get Steps(): number {
    return this.steps
  }

  public get Level(): number {
    return this.aircraftLevel
  }

  public print(): string {
    const levelStr = this.AircraftType != AircraftType.LRA ? `-L${this.Level}` : ``
    return `${this.Id} (${this.Steps})${this.AircraftType}${levelStr}`
  }
}