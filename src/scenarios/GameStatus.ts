import { BattleCyclePhase } from "../gamesequence/BattleCycle"
 
export enum GameType {
    COMPUTER_ONLY,
    ONE_PLAYER
}
export class GameStatus {
    private static currentPhase: BattleCyclePhase = BattleCyclePhase.Lighting
    public static gameType: GameType = GameType.COMPUTER_ONLY

    get CurrentPhase(): BattleCyclePhase {
        return GameStatus.currentPhase
    }

    public static print(message?: any, ...optionalParams: any[]): void {
      console.log(message, ...optionalParams)
    }
}