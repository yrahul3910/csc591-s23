export default class Row {
    cells: Array<number | '?'>;

    constructor(cells: Array<number | '?'>) {
        this.cells = cells;
    }
}