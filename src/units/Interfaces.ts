import { AirUnit } from './AirUnit'
import { BaseUnit } from './BaseUnit'
import { NavalUnit, SubmarineUnit } from './NavalUnit'

export type UnitType = AirUnit | NavalUnit | BaseUnit | SubmarineUnit

export enum Side {
  Japan = 'Japan',
  Allied = 'Allied',
}

export enum ActivationStatus {
  Activated = 'Activated', 
  Unactivated = 'Unactivated', 
  Deactivated = 'Deactivated'
}

export enum AircraftType {
  F = 'F',
  T = 'T', 
  B = 'B', 
  LRA = 'LRA',
  Spotter = 'Spotter'
}
