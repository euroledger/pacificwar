import { LightingCondition, LightingConditionDisplay } from "../displays/LightingConditionDisplay"

export enum NavalCombatCyclePhase {
    NavalCombatDetermination, 
    NavalCombat1, 
    NavalCombat2, 
    NavalCombat3
}

export enum BattleCyclePhase {
    Lighting,
    AdvantageDetermination,
    AdvantageMovement,
    AdvantageAirMission,
    NavalCombat, 
    Bombardment, 
    Demolition, // not in engagement scenarios
    GroundCombat,
    AirfieldRepair, 
    Rally, 
    DisadvantageMovement, 
    DisadvantgeAirMission,
    JointActivationDeactivation, // not in engagement scenarios
    DetectionRemoval, 
    DayMarkerAdjustment // not in engagement scenarios
}

type PhaseHandlerMap = Map<BattleCyclePhase, Function>

export class DefaultBattleCycle {
    private lightingConditionIncrement: number = 1 // may need to set this to 5 if the first battle cycle moves it to DAY PM

    public doSequenceOfPlay() {
        this.lightingPhase()
    }

    public set LightingConditionIncrement(increment: number) {
        this.lightingConditionIncrement = increment
    }

    public lightingPhase() {
        // increment the lighting according to the increment (usually 1)
        LightingConditionDisplay.incrementLightingDisplay(this.lightingConditionIncrement)
    }

    public get LightingCondition(): LightingCondition {
        return LightingConditionDisplay.LightingCondition
    }

    public set LightingCondition(value: LightingCondition) {
        LightingConditionDisplay.LightingCondition = value
    }
}