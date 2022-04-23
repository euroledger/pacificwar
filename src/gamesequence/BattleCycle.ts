import { LightingCondition, LightingConditionDisplay } from "../displays/LightingConditionDisplay"
import { GameStatus } from "../scenarios/GameStatus"

export class DefaultBattleCycle {
    private lightingConditionIncrement: number = 1 

    public async doBattleCycleSequenceOfPlay() {
        await this.lightingPhase()
        await this.advantageDeterminationPhase()
        await this.advantageMovementPhase()
        await this.advantageAirMissionPhase()
        await this.navalCombatCycle()
        await this.disAdvantageDeterminationPhase()
        await this.disAdvantageMovementPhase()
        await this.disAdvantageAirMissionPhase()
        await this.detectionRemoval()
        this.endOfCycle()
        GameStatus.print('\n')
        GameStatus.print(`\t\t\tEND OF BATTLE CYCLE ${GameStatus.battleCycle}`)
    }

    public endOfCycle() {
    }
    
    public async detectionRemoval() {
    }
    
    public async navalCombatCycle() {
    }

    public set LightingConditionIncrement(increment: number) {
        this.lightingConditionIncrement = increment
    }

    public async lightingPhase() {
        // increment the lighting according to the increment (usually 1)
        LightingConditionDisplay.incrementLightingDisplay(this.lightingConditionIncrement)
    }

    public async advantageDeterminationPhase() {
      
    }

    public async advantageMovementPhase() {

    }

    public async advantageAirMissionPhase() {
      
    }

    public async disAdvantageDeterminationPhase() {
      
    }

    public async disAdvantageMovementPhase() {

    }

    public async disAdvantageAirMissionPhase() {
      
    }
    public get LightingCondition(): LightingCondition {
        return LightingConditionDisplay.LightingCondition
    }

    public set LightingCondition(value: LightingCondition) {
        LightingConditionDisplay.LightingCondition = value
    }
}