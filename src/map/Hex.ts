import { DetectionLevel } from "../displays/SearchCharts"
import { Force } from "../forces/Force"
import { TaskForce } from "../forces/TaskForce"
import { AirUnit } from "../units/AirUnit"
import { AircraftType } from "../units/Interfaces"

export class Hex {

    // type -> water, coastal, terrain etc.

    private force: Force | undefined = undefined
    private taskForces: TaskForce[] = new Array<TaskForce>()
    private hexNumber: number = 0
    private detected: boolean = false

    constructor(hexNumber: number) {
        this.hexNumber = hexNumber
    }

    public get HexNumber() {
        return this.hexNumber
    }

    public addForceToHex(force: Force) {
      this.force = force
    }

    public addTaskForceToHex(taskForce: TaskForce) {
      this.taskForces.push(taskForce)
    }

    public get Force() {
      return this.force
    }

    public get CapAirUnits(): AirUnit[] {
      // get alerted air units up to launch capacity of air base + air units from task forces

      let units: AirUnit[] = []
      for (const tf of this.taskForces) {
        units = units.concat(tf.AirUnits)
      }

      // add units from installation (Force) if any
      if (this.force) {
        // units = units.concat(this.force.AirUnits.filter((unit) => unit.AircraftType === AircraftType.F))

        // clarification: all alerted units are part of the defending CAP although only F units
        // can participate (or provide a DRM for) air combat, all [alerted] units can take hits

        // TODO should actually limit this to the number of steps of the airbase
        return this.force.AirUnits
      }

      // todo if there are carriers in port hex, add the carrier air groups - but only if activated
      // this simulates a situation where the carrier is at sea in the same hex as the port hex
      // and not part of a TF
      // carriers in port cannot launch their aircraft
      return units
    }
    public get TaskForces() {
      return this.taskForces
    }

    public set Detected(detected: boolean) {
      this.detected = detected
    }

    public determineReconnaisanceForTaskForces(level: DetectionLevel) {
      // for each task force return the correct level of reconnaisance for the given detection level
      for (const taskForce of this.taskForces) {}
      
    }

    public print(): string {
      return `Hex: ${this.hexNumber} number of Task Forces present = ${this.taskForces.length}`
    }
}