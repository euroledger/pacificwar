import { BattleCyclePhase } from "../gamesequence/BattleCycle"
import { Side } from "../units/Interfaces"
 
export enum GameType {
    COMPUTER_ONLY,
    ONE_PLAYER
}

export class GameStatus {
    private static currentPhase: BattleCyclePhase = BattleCyclePhase.Lighting
    public static gameType: GameType = GameType.COMPUTER_ONLY
    public static advantage: Side

    get CurrentPhase(): BattleCyclePhase {
        return GameStatus.currentPhase
    }

    public static print(message?: any, ...optionalParams: any[]): void {
      console.log(message, ...optionalParams)
    }

    public static async pause(delay: number) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
}