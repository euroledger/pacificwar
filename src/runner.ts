import { Main } from './main'
import { ES1 } from './scenarios/es1PearlHarbor/es1'

export const executor = new Main(new ES1())
executor.main()
