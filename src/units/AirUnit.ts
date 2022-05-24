import { AbstractUnit, Type } from './AbstractUnit'
import { AircraftType, Side } from './Interfaces'

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
  private eliminated!: boolean
  private aborted: boolean = false
  private hitsThisCycle: number = 0

  constructor(options: AirUnitOptions) {
    super(options.name, options.type, options.side, options.id, options.apCost, options.aaStrength, options.hits)
    this.range = options.range
    this.anStrength = options.anStrength
    this.agStrength = options.agStrength
    this.aircraftType = options.aircraftType as AircraftType
    this.aircraftLevel = options.aircraftLevel
    this.reverseAA = options.reverseAA
    this.steps = options.steps
    this.hits = this.aircraftType != AircraftType.LRA ? 6 - this.steps : 0
  }

  public get Range() {
    return this.range
  }

  public get AntiNavalStrength(): number {
    return Math.max(this.anStrength - this.Hits, -1) // -1 means 0(4) on the results table
  }

  public get AntiGroundStrength(): number {
    return Math.max(this.agStrength - this.Hits, -1) // -1 means 0(4) on the results table
  }

  get AAStrength(): number {
    return Math.max(this.aaStrength - this.Hits, -1) // -1 means 0(4) on the results table
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
    if (this.aircraftType === AircraftType.LRA) {
      return 1 - this.Hits
    }
    return 6 - this.Hits
  }

  public get Level(): number {
    return this.aircraftLevel
  }

  public set Steps(steps: number) {
    this.steps = Math.max(steps, 0)
    if (this.steps === 0) {
      this.eliminated = true
    }
    this.hits = 6 - this.steps
  }

  public get Hits(): number {
    return this.hits
  }

  public get HitsThisCycle(): number {
    return this.hitsThisCycle
  }

  public set HitsThisCycle(hitsThisCycle: number) {
    this.hitsThisCycle = hitsThisCycle
  }
  public get Aborted(): boolean {
    return this.aborted
  }

  public set Aborted(aborted: boolean) {
    this.aborted = aborted
  }

  public set Hits(hits: number) {
    this.hits = hits
    this.steps = 6 - this.hits
    if (this.Steps === 0) {
      this.eliminated = true
    }
  }

  public get Eliminated(): boolean {
    return this.eliminated
  }

  public set Eliminated(eliminated: boolean) {
    this.eliminated = eliminated
  }

  public print(): string {
    const levelStr = this.AircraftType != AircraftType.LRA ? `-L${this.Level}` : ``
    return `${this.Id} (${this.Steps})${this.AircraftType}${levelStr}`
  }
}
