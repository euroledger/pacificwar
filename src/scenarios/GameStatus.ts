import { Side } from "../units/Interfaces"
 
export enum GameType {
    COMPUTER_ONLY,
    ONE_PLAYER
}

export class GameStatus {
    public static gameType: GameType = GameType.COMPUTER_ONLY
    public static advantage: Side
    public static battleCycle: number = 1
    public static TestMode = false
    public static numberOfRuns = 1
    public static airStepsEliminated: number = 0
    public static navalUnitHits: number = 0
    public static navalUnitsSunkOrCrippled: number = 0

    public static print(message?: any, ...optionalParams: any[]): void {
      console.log(message, ...optionalParams)
    }

    public static async pause(delay: number) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
}