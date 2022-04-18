import { FileRow, DataLoader } from './dataload/DataLoadService'
import { UnitMapper } from './units/UnitMapper'
import { Logger } from 'tslog'
import { PacificWarScenario as PacificWarScenario } from './scenarios/Scenario'
import { ES1 } from './scenarios/es1PearlHarbor/es1'
import { PlayerContainer } from './scenarios/PlayerContainer'
import { promptUser } from './utils/Utility'
import { GameStatus, GameType } from './scenarios/GameStatus'
import { Side } from './units/Interfaces'

export const logger: Logger = new Logger({
  minLevel: 'info',
  displayDateTime: false,
  displayFunctionName: false,
  displayFilePath: 'hidden',
})

export class Main {
  private rows: FileRow[] | undefined
  private mapper: UnitMapper
  private scenario: PacificWarScenario
  private file!: string
  private alliedPlayer!: PlayerContainer
  private japanesePlayer!: PlayerContainer

  constructor(scenario: PacificWarScenario) {
    this.scenario = scenario
    this.mapper = new UnitMapper()
  }

  public async load() {
    this.file = `../../resources/${this.scenario.CSVFile}`
    const loader = new DataLoader()
    await loader.load(this.file)
    this.rows = loader.FileRows
  }

  public mapRowsToUnits(rows: FileRow[]) {
    this.mapper = new UnitMapper()
    this.mapper.map(rows)
  }

  public async setUpGame() {
    // 2. create player containers
    this.alliedPlayer = new PlayerContainer(
      Side.Allied,
      this.mapper.getUnitsBySide(Side.Allied)
    )
    this.japanesePlayer = new PlayerContainer(
      Side.Japan,
      this.mapper.getUnitsBySide(Side.Japan)
    )

    // 3. game initialization (eg set up task forces)

    // 4. Choose scenario if this is one player
    if (GameStatus.gameType === GameType.ONE_PLAYER) {
      GameStatus.print('Choose one of the scenarios:')
      GameStatus.print('   1. Pearl Harbor')
      GameStatus.print('   2. Savo Isand')
      const scenario = await promptUser({
        type: 'number',
        value: 'value',
        message: 'Please enter 1 or 2?',
      })
      GameStatus.print(`We are going to play scenario ${scenario}`)

      // todo map choice to this.scenaro
    }

    this.scenario.setUpScenario(this.japanesePlayer, this.alliedPlayer)
  }
  public get Rows(): FileRow[] | undefined {
    return this.rows
  }

  public get Mapper(): UnitMapper {
    return this.mapper
  }

  public get AlliedPlayerContainer(): PlayerContainer {
    return this.alliedPlayer
  }

  public get JapanesePlayerContainer(): PlayerContainer {
    return this.japanesePlayer
  }

  public async main() {
    console.clear()
    GameStatus.print('PACIFIC WAR ENGAGEMENT SCENARIOS')
    GameStatus.print(`Loading data for ${this.scenario.Name}`)

    // in future the cvsFile will be given from the scenario object loaded at this point
    // 1. Create all units: one unit per row of CVS
    await this.load()
    if (!this.rows) {
      throw Error(`No rows loaded from file ${this.file}`)
    }
    this.mapRowsToUnits(this.rows)

    await this.setUpGame()
  }
}

function onErr(err: any) {
  GameStatus.print(err)
  return 1
}
// later we dsiplay a menu here and plug in the chosen scenario
const executor = new Main(new ES1())
executor.main()