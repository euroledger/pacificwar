import { Force } from "../forces/Force"
import { TaskForce } from "../forces/TaskForce"

export class Hex {

    // type -> water, coastal, terrain etc.

    private force!: Force
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

    public get TaskForces() {
      return this.taskForces
    }

    public set Detected(detected: boolean) {
      this.detected = detected
    }

    public print(): string {
      return `Hex: ${this.hexNumber} number of Task Forces present = ${this.taskForces.length}`
    }
}