import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse'
import { BaseSize, Type } from '../units/AbstractUnit'
import { logger } from '../main'
import { Side } from '../units/Interfaces'
import { GameStatus } from '../scenarios/GameStatus'

const headers = [
  'Type',
  'Side',
  'ID',
  'Name',
  'AP Cost',
  'AA Strength',
  'Launch Capacity',
  'Hit Capacity',
  'Short Gunnery',
  'Medium Gunnery',
  'Long Gunnery',
  'ASW Strength',
  'Short Torpedo Strength',
  'Medium Torpedo Strength',
  'Bombard Strength',
  'Spotter Plane',
  'Air Group',
  'Range',
  'AN Strength',
  'AG Strength',
  'Aircraft Type',
  'Level',
  'Reverse AA Strength',
  'Steps',
  'Size',
  'Hex'
]

export type FileRow = {
  type: Type
  side: Side
  id: string
  name: string
  apCost: number
  aaStrength: number
  launchCapacity: number
  hitCapacity: string
  shortGunnery: number
  mediumGunnery: number
  longGunnery: number
  aswStrength: number
  shortTorpedo: number
  mediumTorpedo: number
  bombardStrength: number
  spotterPlane: string
  airGroup: string
  range: number
  anStrength: number
  agStrength: number
  aircraftType: string
  aircraftLevel: number
  reverseAA: number
  steps: number
  size: BaseSize
  hexLocation: number
}

export class DataLoader {
  private fileRows: FileRow[] | undefined

  public load = async (file: string) => {
    const csvFilePath = path.resolve(__dirname, file)
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' })

    let b: any[]
    var p = new Promise<any>((res, rej) => {
      parse(
        fileContent,
        {
          delimiter: ',',
          columns: headers,
        },
        (error, result: FileRow[]) => {
          if (error) {
            console.error(error)
          }
          b = result
          let unitArray: FileRow[] = b.map((row) => {
            return {
              type: row['Type'],
              side: row['Side'],
              id: row['ID'],
              name: row['Name'],
              apCost: parseInt(row['AP Cost']),
              aaStrength: parseInt(row['AA Strength']),
              launchCapacity: parseInt(row['Launch Capacity']),
              hitCapacity: row['Hit Capacity'],
              shortGunnery: parseInt(row['Short Gunnery']),
              mediumGunnery: parseInt(row['Medium Gunnery']),
              longGunnery: parseFloat(row['Long Gunnery']),
              aswStrength: parseInt(row['ASW Strength']),
              shortTorpedo: parseInt(row['Short Torpedo Strength']),
              mediumTorpedo: parseInt(row['Medium Torpedo Strength']),
              bombardStrength: parseInt(row['Bombard Strength']),
              spotterPlane: row['Spotter Plane'],
              airGroup: row['Air Group'],
              range: parseInt(row['Range']),
              anStrength: parseInt(row['AN Strength']),
              agStrength: parseInt(row['AG Strength']),
              aircraftType: row['Aircraft Type'],
              aircraftLevel: parseInt(row['Level']),
              reverseAA: parseInt(row['Reverse AA Strength']),
              steps: parseInt(row['Steps']),
              size: row['Size'],
              hexLocation: parseInt(row['Hex'])
            }
          })
          res(unitArray)
        }
      )
    })
    let x = await p

    GameStatus.print(`DataLoader: ${x.length} rows loaded`)

    // remove headers
    x = x.slice(1)
    this.fileRows = x
  }

  public set FileRows(fileRows: FileRow[] | undefined) {
    if (fileRows) {
      this.fileRows = fileRows
    }
  }

  public get FileRows(): FileRow[] | undefined {
    return this.fileRows
  }
}
