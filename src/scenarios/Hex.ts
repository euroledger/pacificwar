export class Hex {
    // hex location id, name etc.

    // type -> water, coastal, terrain etc.

    // contents -> bases, forces etc.
    private hexNumber: number = 0

    constructor(hexNumber: number) {
        this.hexNumber = hexNumber
    }

    public get HexNumber() {
        return this.hexNumber
    }
}