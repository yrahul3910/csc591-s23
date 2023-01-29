import * as fs from 'fs';

import Cols from './Cols';
import Row from './Row';
import Num from './Num';
import Sym from './Sym';

export default class Data {
    rows: Row[];
    cols: Cols | null;
    A: Row;
    B: Row;
    mid: number;
    c: number;
    left: Data;
    right: Data;

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
        this._many = this._many.bind(this);
        this.half = this.half.bind(this);
        this._clone = this._clone.bind(this);
        this.cluster = this.cluster.bind(this);
    }

    read_csv(filename: string) {
        const data = fs.readFileSync(filename).toString();
        const lines = data.split('\n');

        for (const line of lines) {
            const cells = line.split(/,\s*/);
            const row = new Row(cells as (number | '?')[]);
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

    better(row1: Row, row2: Row) {
        let s1 = 0, s2 = 0;

        for (let i = 0; i < this.cols.y.length; i++) {
            const col = this.cols.y[i];
            const x = col.norm(row1.cells[col.at]);
            const y = col.norm(row2.cells[col.at]);

            if (x === '?' || y === '?') continue;

            s1 -= Math.exp(col.w * (x - y) / this.cols.y.length);
            s2 -= Math.exp(col.w * (y - x) / this.cols.y.length);
        }

        return s1 < s2;
    }

    dist(row1: Row, row2: Row, cols: Cols) {
        let n = 0, d = 0;

        if (!cols)
            cols = this.cols;
        
        for (let i = 0; i < cols.cols.length; i++) {
            const col = cols.cols[i];
            ++n;
            d += Math.pow(col.dist(row1.cells[col.at], row2.cells[col.at]), 2);
        }

        return Math.pow(d / n, 1 / 2);
    }

    around(row1: Row, rows: Row[], cols: Cols) {
        if (!rows) rows = this.rows;
        if (!cols) cols = this.cols;

        return rows.map(row2 => [row2, this.dist(row1, row2, cols)])
            .sort((a, b) => (a[1] as number) - (b[1] as number))
            .map(row => row[0]);
    }

    _any(rows: any[]) {
        // Return one row from `rows` at random
        return rows[Math.floor(Math.random() * rows.length)];
    }

    _many(rows: any[], n: number) {
        // Return `n` rows from `rows` at random
        const many = [];

        for (let i = 0; i < n; i++) {
            many.push(this._any(rows));
        }

        return many;
    }

    _cosine(a: number, b: number, c: number) {
        const x1 = (Math.pow(a, 2) + Math.pow(c, 2) - Math.pow(b, 2)) / (2 * a * c);
        const x2 = Math.max(0, Math.min(1, x1));
        const y = Math.sqrt(Math.pow(a, 2) - Math.pow(x2, 2));

        return y;
    }

    half(rows: Row[], cols: Cols, above: Row, sample=512, far=0.95) {
        if (!rows) rows = this.rows;
        if (!cols) cols = this.cols;

        const some: Row[] = this._many(rows, sample);
        const A: Row = above || this._any(some);
        const B: Row = this.around(A, some, this.cols)[Math.round(far * rows.length)] as Row;
        const c: number = this.dist(A, B, this.cols);

        const arr = rows.map(row => [row, this._cosine(this.dist(row, A, this.cols), this.dist(row, B, this.cols), c)])
            .sort((a, b) => (a[1] as number) - (b[1] as number));
        
        const left = [], right = [];
        let mid = null;
        for (let i = 0; i < arr.length; i++) {
            if (i <= arr.length / 2) {
                left.push(arr[i][0]);
                mid = arr[i][0] as Row;
            }
            else
                right.push(arr[i][0]);
        }

        return [left, right, A, B, mid, c];
    }

    _clone(init: Row[]) {
        if (!init) init = this.rows;
        const data = new Data(init);
        data.cols = this.cols;
        data.add(init[0]);

        return data;
    }

    cluster(rows: Row[], min: number, cols: Cols, above: Row) {
        if (!rows) rows = this.rows;
        if (!cols) cols = this.cols;
        if (!min) min = Math.sqrt(rows.length);

        const node: Data = this._clone(rows);

        if (rows.length > 2 * min) {
            const [left, right, A, B, mid, c] = this.half(rows, cols, above);
            node.A = A as Row;
            node.B = B as Row;
            node.mid = mid as number;
            node.c = c as number;

            node.left = this.cluster(left as Row[], min, cols, node.A);
            node.right = this.cluster(right as Row[], min, cols, node.B);
        }

        return node;
    }

    sway(rows: Row[], min: number, cols: Cols, above: Row) {
        if (!rows) rows = this.rows;
        if (!min) min = Math.sqrt(rows.length);
        if (!cols) cols = this.cols;
        
        const node: Data = this._clone(rows);
        if (rows.length > 2 * min) {
            const [left, right, A, B, mid, c] = this.half(rows, cols, above);
            node.A = A as Row;
            node.B = B as Row;
            node.mid = mid as number;
            node.c = c as number;

            if (this.better(node.B, node.A)) {
                this.left = new Data(left as Row[]);
                this.right = new Data(right as Row[]);
                node.A = node.B;
                node.B = node.A;
            }

            node.left = this.sway(left as Row[], min, cols, node.A);
        }

        return node;
    }
}