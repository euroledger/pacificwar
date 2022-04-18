import { logger } from '../main'
import { ActivationStatus, Side } from './Interfaces'

export enum BaseSize {
  Large = 'Large',
  Small = 'Small',
}

export enum Type {
  Naval = 'Naval',
  Air = 'Air',
  Submarine = 'Submarine',
  Base = 'Base',
}
export abstract class AbstractUnit {
  protected name!: string
  protected type!: Type
  protected side!: Side
  protected id!: string
  protected apCost!: number
  protected aaStrength!: number
  protected hits!: number
  protected activationStatus: ActivationStatus = ActivationStatus.Unactivated

  constructor(
    name: string,
    type: Type,
    side: Side,
    id: string,
    apCost: number,
    aaStrength: number,
    hits: number
  ) {
    this.name = name
    this.type = type
    this.side = side
    this.id = id
    this.apCost = apCost
    this.aaStrength = aaStrength
    this.hits = hits
  }
  set Hits(hits: number) {
    this.hits = hits
  }

  get Hits(): number {
    return this.hits
  }

  get Name(): string {
    return this.name
  }

  get Type(): Type {
    return this.type
  }

  get Id(): string {
    return this.id
  }
  get AAStrength(): number {
    return this.aaStrength
  }

  public get Side(): Side {
    return this.side
  }

  public isNavalUnit(): boolean {
    const keys = Object.keys(this)

    if (keys.includes('crippled')) {
      return true
    }
    return false
  }

  public isAirUnit(): boolean {
    const keys = Object.keys(this)

    if (keys.includes('range')) {
      return true
    }
    return false
  }

  
  public isBaseUnit(): boolean {
    const keys = Object.keys(this)

    if (keys.includes('size')) {
      return true
    }
    return false
  }
  
  public get ActivationStatus() :ActivationStatus {
    return this.activationStatus
  }

  public set ActivationStatus(value: ActivationStatus) {
    this.activationStatus = value
  }

  public print(): void {
    logger.debug(
      `Unit name=${this.name} :: id=${this.id} :: side=${this.side} :: type=${this.type} :: AP Cost=${this.apCost} 
      :: AA Strength=${this.aaStrength} :: hits=${this.hits}`
    )
  }
}
