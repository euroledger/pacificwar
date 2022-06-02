
/* Number of battleship targets in a group of targets for air units to attack on the first battle cycle */
export const numBattleshipsPerTargetGroup = 6

/* Number of ship targets in second battle cycle if VPs already sufficient (or almost sufficient) to win */
export const numShipsPerTargetGroup = 3

/* Max number Air Units to be attacked on battle cycle 1 */
export const maxNumberOfAirUnitTargets= 3

/* Minimum number of air units to attack on battle cycle 1 */
export const minNumberOfAirUnitTargets= 1

/* Move one Japanese task force on battle cycle 1 */
/* This is to avoid the -1 DRM on BC2 searches */
export const moveJapaneseTaskForceBC1 = false

