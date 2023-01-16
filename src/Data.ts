import * as fs from 'fs';

import Cols from './Cols';
import Row from './Row';
import Num from './Num';
import Sym from './Sym';

export default class Data {
    rows: Row[];
    cols: Cols | null;

    constructor(src: string | Row[]) {
        this.rows = [];
        this.cols = null;

        if (typeof(src) === 'string') {
            // Read CSV from src
            this.read_csv(src);
        } else {
            for (const row of src) {
                this.add(row);
            }
        }

        this.add = this.add.bind(this);
        this.stats = this.stats.bind(this);
        this.read_csv = this.read_csv.bind(this);
    }

    read_csv(filename: string) {
        const data = fs.readFileSync(filename).toString();
        const lines = data.split('\n');

        for (const line of lines) {
            const cells = line.split(/,\s*/);
            const row = new Row(cells);
            this.add(row);
        }
    }

    add(row: Row) {
        if (this.cols) {
            this.rows.push(row);
            this.cols.add(row);
        } else {
            this.cols = new Cols(row.cells as string[]);
        }
    }

    *stats(cols: Array<Num | Sym>, stat: 'mid' | 'div'='mid') {
        const columns = cols || (this.cols && this.cols.y);

        for (const col of columns) {
            yield col[stat]();
        }
    }
}