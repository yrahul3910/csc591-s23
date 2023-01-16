import Num from './Num';
import Sym from './Sym';
import Row from './Row';

export default class Cols {
    cols: Array<Num | Sym>;
    klass: Num | Sym;
    y: Array<Num>;
    x: Array<Num | Sym>;
    names: string[];

    constructor(names: string[]) {
        this.cols = [];
        this.klass = null;
        this.y = [];
        this.x = [];
        this.names = names;

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            let col;
            if (/^[A-Z]/.test(name))
                col = new Num(i, name);
            else
                col = new Sym(i, name);
            
            this.cols.push(col);

            if (!/X$/.test(name)) {
                if (/!$/.test(name)) this.klass = col;
                if (/[!+-]$/.test(name))
                    this.y.push(col as Num);
                else
                    this.x.push(col);
            }
        }
    }

    add(row: Row) {
        for (let i = 0; i < this.x.length; i++) {
            for (const col of this.cols) {
                col.add(row.cells[col.at]);
            }
        }
    }
}