import { AircraftType } from "../units/Interfaces"
import { DetectionLevel, NavalSearchTable, SearchResultsForDistance, SearchResultsForTimeOfDay, TimeOfDay } from "./SearchCharts"

const japaneseLRADayResults: SearchResultsForDistance = new Map([
  [0, [[0, 5], [6, 7], [8]]], // shows results for LRA-day search for same hex: 0-5 is number and types of all naval units, 6-7 is number of capital and non-capital ships and whether there are any carries, 8 is number of naval units +-50%
  [1, [[0, 3], [4, 5], [6]]],
  [2, [[0, 2], [3, 4], [5]]],
  [3, [[0, 1], [2, 3], [4]]],
  [4, [[0], [1, 2], [3]]],
  [5, [[DetectionLevel.undetected], [0, 1], [2]]],
  [6, [[DetectionLevel.undetected], [0], [1]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
])
const japaneseLRANightResults: SearchResultsForDistance = new Map([
  [0, [[0, 2], [3, 4], [5]]], 
  [1, [[0], [1,2], [3]]],
  [2, [[DetectionLevel.undetected], [0,1], [2]]],
  [3, [[DetectionLevel.undetected], [0], [1]]],
  [4, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [5, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
])


const japaneseFTBDayResults: SearchResultsForDistance = new Map([
  [0, [[0, 5], [6, 7], [8]]],
  [1, [[0, 2], [3, 4], [5]]],
  [2, [[0, 1], [2, 3], [4]]],
  [3, [[0], [1, 2], [3]]],
  [4, [[DetectionLevel.undetected], [0,1], [2]]],
  [5, [[DetectionLevel.undetected], [0], [1]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
])

const japaneseFTBNightResults: SearchResultsForDistance = new Map([
  [0, [[0, 2], [3, 4], [5]]], 
  [1, [[DetectionLevel.undetected], [0], [1]]],
  [2, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [3, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [4, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [5, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
])

const japaneseSpotterDayResults: SearchResultsForDistance = new Map([
  [0, [[0, 5], [6, 7], [8]]],
  [1, [[0,1], [2,3], [4]]],
  [2, [[0], [1,2], [3]]],
  [3, [[DetectionLevel.undetected], [0,1], [2]]],
  [4, [[DetectionLevel.undetected], [0], [1]]],
  [5, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
])

const japaneseSpotterNightResults: SearchResultsForDistance = new Map([
  [0, [[0, 2], [3, 4], [5]]], 
  [1, [[DetectionLevel.undetected], [0,1], [2]]],
  [2, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [3, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [4, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [5, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
])

const japaneseAirSearchDayResults: SearchResultsForDistance = new Map([
  [0, [[0, 2], [3, 4], [5]]]
])

const japaneseAirSearchNightResults: SearchResultsForDistance = new Map([
  [0, [[0, 1], [2, 3], [4]]]
])

const japaneseLRASearchTable: SearchResultsForTimeOfDay = new Map([
  [TimeOfDay.Day, japaneseLRADayResults],
  [TimeOfDay.Night, japaneseLRANightResults],
])
const japaneseFTBSearchTable: SearchResultsForTimeOfDay = new Map([
  [TimeOfDay.Day, japaneseFTBDayResults],
  [TimeOfDay.Night, japaneseFTBNightResults],
])

const japaneseSpotterSearchTable: SearchResultsForTimeOfDay = new Map([
  [TimeOfDay.Day, japaneseSpotterDayResults],
  [TimeOfDay.Night, japaneseSpotterNightResults],
])

export const japaneseAirSearchChartResults: SearchResultsForTimeOfDay = new Map([
  [TimeOfDay.Day, japaneseAirSearchDayResults],
  [TimeOfDay.Night, japaneseAirSearchNightResults],
])

export const japaneseNavalSearchChartResults: NavalSearchTable = new Map([
  [AircraftType.LRA, japaneseLRASearchTable],
  [AircraftType.F, japaneseFTBSearchTable],
  [AircraftType.T, japaneseFTBSearchTable],
  [AircraftType.B, japaneseFTBSearchTable],
  [AircraftType.Spotter, japaneseSpotterSearchTable],
])


