import { Main } from "../src/main"
import { ES1 } from "../src/scenarios/es1PearlHarbor/es1"
import { PlayerContainer } from "../src/scenarios/PlayerContainer"
import { Side } from "../src/units/Interfaces"

const executor = new Main(new ES1())

describe('Player Containers', () => {
    beforeAll(async () => {
        await executor.load()
        if (!executor.Rows) {
            throw Error('No rows loaded')
        }
        executor.mapRowsToUnits(executor.Rows)
    })
    test('Player Units', async () => {
        const alliedPlayer = new PlayerContainer(Side.Allied, Main.Mapper.getUnitsBySide(Side.Allied))
        expect(alliedPlayer.Units.length).toBe(27)

        const japanesePlayer = new PlayerContainer(Side.Japan, Main.Mapper.getUnitsBySide(Side.Japan))
        expect(japanesePlayer.Units.length).toBe(16)
    })
  })
  