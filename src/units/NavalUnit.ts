import { AbstractUnit, Type } from './AbstractUnit'
import { Side } from './Interfaces'

const CapitalShips: string[] = ['CV', 'CVL', 'CVS', 'BB', 'BC']

interface NavalUnitOptions {
  name: string
  type: Type
  side: Side
  id: string
  apCost: number
  hits: number
  aaStrength: number
  hitCapacity: string
  shortGunnery: number
  mediumGunnery: number
  longGunnery: number
  bombardStrength: number
  shortTorpedo: number
  mediumTorpedo: number
  launchCapacity: number
  airGroup: string
  spotterPlane: string
}

interface SubmarineUnitOptions extends NavalUnitOptions {
  steps: number
}

export class SubmarineUnit extends AbstractUnit {
  private steps!: number
  constructor(options: SubmarineUnitOptions) {
    super(
      options.name,
      options.type,
      options.side,
      options.id,
      options.apCost,
      options.aaStrength,
      options.hits
    )
    this.steps = options.steps
  }
  public get Steps(): number {
    return this.steps
  }
}

export class NavalUnit extends AbstractUnit {
  private launchCapacity!: number
  private hitCapacity: number = 0
  private canBeCrippled: boolean = false
  private crippled: boolean = false
  private sunk: boolean = true
  private shortGunnery!: number
  private mediumGunnery!: number
  private longGunnery!: number
  private bombardStrength!: number
  private shortTorpedo!: number
  private mediumTorpedo!: number
  private airGroup!: string
  private spotterPlane!: string
  private loaded: boolean = false

  constructor(options: NavalUnitOptions) {
    super(
      options.name,
      options.type,
      options.side,
      options.id,
      options.apCost,
      options.aaStrength,
      options.hits
    )
    if (options.hitCapacity.startsWith('c')) {
      this.canBeCrippled = true
    }
    this.hitCapacity = parseInt(options.hitCapacity.replace('c', ''))
    this.launchCapacity = options.launchCapacity
    this.shortGunnery = options.shortGunnery
    this.mediumGunnery = options.mediumGunnery
    this.longGunnery = options.longGunnery
    this.bombardStrength = options.bombardStrength
    this.airGroup = options.airGroup
    this.shortTorpedo = options.shortTorpedo
    this.mediumTorpedo = options.mediumTorpedo
    this.spotterPlane = options.spotterPlane
  }

  print(): string {
    return `${this.Id} ${this.Name}`
  }

  public get AirGroup(): string {
    return this.airGroup
  }

  public hasSpotterPlane(): boolean {
    return this.spotterPlane === 'Y'
  }

  public isCapitalShip(): boolean {
    return (
      CapitalShips.filter((abbreviation) => this.id.startsWith(abbreviation))
        .length > 0
    )
  }

  public isCarrier(): boolean {
    return !(this.AirGroup === undefined || this.AirGroup == '')
  }
  public get HitCapacity(): number {
    return this.hitCapacity
  }

  public get ShortGunnery(): number {
    return this.shortGunnery
  }

  public get MediumGunnery(): number {
    return this.mediumGunnery
  }

  public get ShortTorpedo(): number {
    return this.shortTorpedo
  }

  public get MediumTorpedo(): number {
    return this.mediumTorpedo
  }

  public get LongGunnery(): number {
    return this.longGunnery
  }

  public get BombardStrength(): number {
    return this.bombardStrength
  }

  public get LaunchCapacity(): number {
    return this.launchCapacity
  }

  public get Crippled(): boolean {
    return this.crippled
  }

  public get Sunk(): boolean {
    return this.sunk
  }

  public set Sunk(sunk: boolean) {
    this.sunk = sunk
  }

  public set Crippled(crippled: boolean) {
    this.crippled = crippled
  }

  public get CanBeCrippled(): boolean {
    return this.canBeCrippled
  }

  public setLoaded(loaded: boolean): void {
    this.loaded = loaded
  }

  public get Loaded(): boolean {
    return this.loaded
  }
}
