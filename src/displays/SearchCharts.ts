import { AircraftType } from "../units/Interfaces"

export type SearchResults = Array<Array<number | DetectionLevel>>
export type SearchResultsForDistance = Map<number, SearchResults>
export type SearchResultsForTimeOfDay = Map<TimeOfDay, SearchResultsForDistance> // maps the time of day to the correct set of results
export type NavalSearchTable = Map<AircraftType, SearchResultsForTimeOfDay> // map LRA, F, T, B or Spotter to correct table

export enum TimeOfDay {
  Day = 'Day',
  Night = 'Night',
}

export interface SearchOptions {
  range: number
  dieRoll: number
  timeOfDay: TimeOfDay
  navalSearchTable?: NavalSearchTable
  airSearchTable?: SearchResultsForTimeOfDay
  searchingAirUnitType?: AircraftType
  DRM?: number
}

export enum DetectionLevel {
  undetected = 'undetected',
  detectedGreen = 'detected (Green)',
  detectedBlue = 'detected (Blue)', 
  detectedRed = 'detected (Red)',
}

export const SearchResultArray: Array<DetectionLevel> = [
  DetectionLevel.detectedGreen,
  DetectionLevel.detectedBlue,
  DetectionLevel.detectedRed,
  DetectionLevel.undetected,
]

// used for both Allied and Japanese searches...correct table plugged in via options object
export class SearchChart {
  public static searchForNaval(options: SearchOptions) {
    // first get the correct table for aircraft type
    if (!options.navalSearchTable){
      throw Error(
        `No naval search table provided in searchForNaval()`
      )  
    }

    if (!options.searchingAirUnitType){
      throw Error(
        `No searching air unit type provided in searchForNaval()`
      )  
    }

    if (options.range < 0 || options.range > 8) {
      throw Error(`Range is not allowed: ${options.range}`)
    }

    const resultsForTimeOfDay: SearchResultsForTimeOfDay | undefined =
    options.navalSearchTable.get(options.searchingAirUnitType)

    if (!resultsForTimeOfDay) {
      throw Error(
        `No result found in Search Results for Time of Day for aircraft type ${options.searchingAirUnitType}`
      )
    }
    // gives us the LRASearchTable
    // now get the day or night search results
    const searchResults: SearchResultsForDistance | undefined =
      resultsForTimeOfDay.get(options.timeOfDay)
    if (!searchResults) {
      throw Error(
        `No result found in Search Results for Distance for time of day ${options.timeOfDay}`
      )
    }
    // gives us the LRADayResults table
    // now get the result for the range and die roll

    // first get row
    const resultRow: SearchResults | undefined = searchResults.get(options.range)
    if (!resultRow) {
      throw Error(
        `No result row found in Search Results for range ${options.range}`
      )
    }
    // then use the die roll to index into the row
    let result: number | DetectionLevel = DetectionLevel.undetected

    if (options.DRM) { 
      options.dieRoll = options.dieRoll + options.DRM
    }
    
    resultRow.map((row, index) => {
      if (options.dieRoll >= row[0] && options.dieRoll <= row[row.length - 1]) {
        result = index
        return
      }
    })
    if (typeof(result) === 'number') {
      return SearchResultArray[result]
    }
    return result
  }

  public static searchForAir(options: SearchOptions) {
    if (!options.airSearchTable){
      throw Error(
        `No air search table provided in searchForAir()`
      )  
    }

    if (options.range != 0) {
      throw Error(`Range can only be 0 for Air Search`)
    }
    // Get the day or night search results
    const searchResults: SearchResultsForDistance | undefined =
      options.airSearchTable.get(options.timeOfDay)
    if (!searchResults) {
      throw Error(
        `No result found in Search Results for Distance for time of day ${options.timeOfDay}`
      )
    }
    // now get the result for the range and die roll

    // first get row
    const resultRow: SearchResults | undefined = searchResults.get(options.range)
    if (!resultRow) {
      throw Error(
        `No result row found in Search Results for range ${options.range}`
      )
    }
    // then use the die roll to index into the row
    let result: number | DetectionLevel = DetectionLevel.undetected

    resultRow.map((row, index) => {
      if (options.dieRoll >= row[0] && options.dieRoll <= row[row.length - 1]) {
        result = index
        return
      }
    })
    if (typeof(result) === 'number') {
      return SearchResultArray[result]
    }
    return result
  }

  // search for Force uses same chart as Search For Air
  public static searchForForce() {
    return DetectionLevel.detectedGreen // clarification from Mark Herman
  }
}
