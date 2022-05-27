import { AbstractUnit, Type } from './AbstractUnit'
import { Side } from './Interfaces'

const CapitalShips: string[] = ['CV', 'CVL', 'CVS', 'BB', 'BC']

const AircaftCarriers: string[] = ['CV', 'CVL', 'CVE']

export enum NavalUnitType {
  Battleship = 'Battleship',
  AircraftCarrier = 'Aircraft Carrier',
  Battlecruiser = 'Battle Cruiser',
  LightCarrier = 'Light Carrier',
  SeaplaneCarrier = 'Seaplane Carrier',
  EscortCarrier = 'Escort Carrier',
  HeavyCruiser = 'Heavy Cruiser',
  LightCruiser = 'Light Cruiser',
  Destroyer = 'Destroyer',
  DestroyerEscort = 'Destroyer Escort',
  DestroyerTransort = 'Destroyer Transort',
  AmphibiousTransport = 'Amphibious Transport',
  SeaplaneTender = 'Seaplane Tender'
}

const navalUnitMap: Readonly<Map<string, NavalUnitType>> = new Map([
  ['BB', NavalUnitType.Battleship],
  ['BC', NavalUnitType.Battlecruiser],
  ['CV', NavalUnitType.AircraftCarrier],
  ['CVE', NavalUnitType.EscortCarrier],
  ['CVS', NavalUnitType.SeaplaneCarrier],
  ['CVL', NavalUnitType.LightCarrier],
  ['CA', NavalUnitType.HeavyCruiser],
  ['CL', NavalUnitType.LightCruiser],
  ['DD', NavalUnitType.Destroyer],
  ['DE', NavalUnitType.DestroyerEscort],
  ['APD', NavalUnitType.DestroyerTransort],
  ['AA', NavalUnitType.AmphibiousTransport],
  ['ST', NavalUnitType.SeaplaneTender]
])

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
  aswStrength: number
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
  private sunk: boolean = false
  private shortGunnery!: number
  private mediumGunnery!: number
  private longGunnery!: number
  private bombardStrength!: number
  private shortTorpedo!: number
  private mediumTorpedo!: number
  private aswStrength!: number
  private airGroup!: string
  private spotterPlane!: string
  private loaded: boolean = false
  private navalUnitType!: NavalUnitType | undefined

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
    this.aswStrength = options.aswStrength
    this.spotterPlane = options.spotterPlane

    this.setNavalUnitType(this.id)
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
    return (CapitalShips.filter((abbreviation) => this.id.startsWith(abbreviation)).length > 0)
  }

  public isCarrier(): boolean {
    return (AircaftCarriers.filter((abbreviation) => this.id.startsWith(abbreviation)).length > 0)  
  }

  public get HitCapacity(): number {
    return this.hitCapacity
  }

  public get ShortGunnery(): number {
    return Math.max(this.shortGunnery - this.Hits, -1) // -1 means 0(4) on the results table
  }

  public get MediumGunnery(): number {
    return Math.max(this.mediumGunnery - this.Hits, -1) 
  }

  public get LongGunnery(): number {
    return Math.max(this.longGunnery - this.Hits, -1) 
  }
  
  public get ShortTorpedo(): number {
    return Math.max(this.shortTorpedo - this.Hits, -1) 
  }

  public get MediumTorpedo(): number {
    return Math.max(this.mediumTorpedo - this.Hits, -1) 
  }

  public get BombardStrength(): number {
    return Math.max(this.bombardStrength - this.Hits, -1) 
  }

  public get ASW(): number {
    return Math.max(this.aswStrength - this.Hits, -1) 
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

  public get NavalUnitType(): NavalUnitType | undefined {
    return this.navalUnitType
  }

  public setNavalUnitType(id: string) {
    let reg = /\d/;
    let index = id.search(reg);
    const prefix = id.substring(0, index)
    
    if (id.startsWith('CVL')) {
      this.navalUnitType = NavalUnitType.LightCarrier
    } else if(id.startsWith('CVS')) {
      this.navalUnitType = NavalUnitType.SeaplaneCarrier
    } else {
      this.navalUnitType = navalUnitMap.get(prefix)
    }
  }

  public setLoaded(loaded: boolean): void {
    this.loaded = loaded
  }

  public get Loaded(): boolean {
    return this.loaded
  }
}
