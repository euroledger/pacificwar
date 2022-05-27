import { AircraftType } from "../units/Interfaces"
import { DetectionLevel, NavalSearchTable, SearchResultsForDistance, SearchResultsForTimeOfDay, TimeOfDay } from "./SearchCharts"

const alliedLRADayResults: Readonly<SearchResultsForDistance> = new Map([
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
const alliedLRANightResults: Readonly<SearchResultsForDistance> = new Map([
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


const alliedFTBDayResults: Readonly<SearchResultsForDistance> = new Map([
  [0, [[0, 5], [6, 7], [8]]],
  [1, [[0, 2], [3, 4], [5]]],
  [2, [[0, 1], [2, 3], [4]]],
  [3, [[0], [1, 2], [3]]],
  [4, [[DetectionLevel.undetected], [0,1], [2]]],
  [5, [[DetectionLevel.undetected], [0], [1]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
])

const alliedFTBNightResults: Readonly<SearchResultsForDistance> = new Map([
  [0, [[0, 2], [3, 4], [5]]], 
  [1, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [2, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [3, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [4, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [5, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
])

const alliedSpotterDayResults: Readonly<SearchResultsForDistance> = new Map([
  [0, [[0, 5], [6, 7], [8]]],
  [1, [[0], [1,2], [3]]],
  [2, [[DetectionLevel.undetected], [0,1], [2]]],
  [3, [[DetectionLevel.undetected], [0], [1]]],
  [4, [[DetectionLevel.undetected], [DetectionLevel.undetected], [0]]],
  [5, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
])

const alliedSpotterNightResults: Readonly<SearchResultsForDistance> = new Map([
  [0, [[0, 2], [3, 4], [5]]], 
  [1, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [2, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [3, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [4, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [5, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [6, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [7, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
  [8, [[DetectionLevel.undetected], [DetectionLevel.undetected], [DetectionLevel.undetected]]],
])

const alliedAirSearchDayResults: Readonly<SearchResultsForDistance> = new Map([
  [0, [[0, 3], [4, 5], [6]]]
])

const alliedAirSearchNightResults: Readonly<SearchResultsForDistance> = new Map([
  [0, [[0, 1], [2, 3], [4]]]
])

const alliedLRASearchTable: Readonly<SearchResultsForTimeOfDay> = new Map([
  [TimeOfDay.Day, alliedLRADayResults],
  [TimeOfDay.Night, alliedLRANightResults],
])
const alliedFTBSearchTable: Readonly<SearchResultsForTimeOfDay> = new Map([
  [TimeOfDay.Day, alliedFTBDayResults],
  [TimeOfDay.Night, alliedFTBNightResults],
])

const alliedSpotterSearchTable: Readonly<SearchResultsForTimeOfDay> = new Map([
  [TimeOfDay.Day, alliedSpotterDayResults],
  [TimeOfDay.Night, alliedSpotterNightResults],
])

export const alliedAirSearchChartResults: Readonly<SearchResultsForTimeOfDay> = new Map([
  [TimeOfDay.Day, alliedAirSearchDayResults],
  [TimeOfDay.Night, alliedAirSearchNightResults],
])

export const alliedSearchChartResults: Readonly<NavalSearchTable> = new Map([
  [AircraftType.LRA, alliedLRASearchTable],
  [AircraftType.F, alliedFTBSearchTable],
  [AircraftType.T, alliedFTBSearchTable],
  [AircraftType.B, alliedFTBSearchTable],
  [AircraftType.Spotter, alliedSpotterSearchTable],
])


