import { DefaultBattleCycle } from "../gamesequence/BattleCycle"
import { GameStatus } from "./GameStatus"
import { PlayerContainer } from "./PlayerContainer"

export interface ScenarioOptions {
    name: string,
    number: number
    csvFile: string
    numberBattleCycles: number
}

export abstract class PacificWarScenario {
    private name!: string
    private number!: number
    private csvFile!: string
    private numberBattleCycles!: number
    protected japanesePlayer!: PlayerContainer
    protected allPlayers!: PlayerContainer
    protected battleCycle!: DefaultBattleCycle

    constructor(options: ScenarioOptions) {
        this.name = options.name
        this.number = options.number
        this.csvFile = options.csvFile
        this.numberBattleCycles = options.numberBattleCycles
    }

    // call this after data load with units to be allocated to forces, task forces etc.
    abstract setUpScenario(japanesePlayer: PlayerContainer, alliedPlayer: PlayerContainer):  Promise<void>
    
    public async doSequenceOfPlay() {
      await GameStatus.pause(2500)

      for (let i = 0; i < this.numberBattleCycles; i++) {
        GameStatus.battleCycle = i+1
        GameStatus.print(
          '-------------------------------------------------------------------------------------------------'
        )
        GameStatus.print("\n\t\t")
        GameStatus.print(`\t\t\tBATTLE CYCLE ${GameStatus.battleCycle}`)
        GameStatus.print("\t\t\t============================")
        GameStatus.print('\n')

        await this.battleCycle.doBattleCycleSequenceOfPlay()
      }
     
    }

    public get Name() {
        return this.name
    }

    public get Number() {
        return this.number
    }

    public get CSVFile() {
        return this.csvFile
    }

    public get NumberBattleCycles() {
        return this.numberBattleCycles
    }
}