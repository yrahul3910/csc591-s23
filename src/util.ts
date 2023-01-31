/* eslint-disable no-console */
import Data from './Data';
import Row from './Row';
import grid from './repgrid';

interface RepGrid {
    domain: string;
    cols: (number | string)[][];
    rows: string[][];
}

const transpose = (matrix: (number | string)[][]) => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = new Array<Array<number | string>>(cols);

    for (let i = 0; i < cols; i++) {
        result[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            result[i][j] = matrix[j][i];
        }
    }

    return result;
};

const repCols = (cols: (number | string)[][]) => {
    const copy = [...cols];
    copy.forEach(col => {
        col[col.length - 1] = `${col[0]}:${col[col.length - 1]}`;
        
        for (let j = 1; j < copy.length; j++) {
            copy[j-1] = copy[j];
        }
        copy.pop();
    });

    copy.unshift(cols[0].map((v: any, k: any) => `Num${k}`));
    cols[0][cols[0].length - 1] = 'thingX';

    return new Data(cols);
};

const repRows = (t: RepGrid, rows: (number | string)[][]) => {
    rows = [...rows];
    const lastRow = rows[rows.length - 1];
    for (let j = 0; j < lastRow.length; j++) {
        rows[0][j] = `${rows[0][j]}:${lastRow[j]}`;
    }
    rows.pop();
    for (let n = 0; n < rows.length; n++) {
        if (n === 0) {
            rows[n].push('thingX');
        } else {
            const u = t.rows[t.rows.length - n + 2];
            rows[n].push(u[u.length - 1]);
        }
    }
    return new Data(rows);
};

const repPlace = (data: Data) => {
    const n = 20, g = [];

    for (let i = 0; i < n + 1; i++) {
        g[i] = [];
        for (let j = 0; j < n + 1; j++) g[i][j] = ' ';
    }

    let maxy = 0;
    console.log('');
    for (let r = 0; r < data.rows.length; r++) {
        const row = data.rows[r];
        const c = String.fromCharCode(64 + r);
        console.log(c, row.cells[row.cells.length - 1]);
        const x = (row.x * n) >> 0;
        const y = (row.y * n) >> 0;
        maxy = Math.max(maxy, y + 1);
        g[y + 1][x + 1] = c;
    }
    console.log('');
    for (let y = 1; y < maxy; y++) console.log(g[y]);
};
  
const repgrid = () => {
    const rows = repRows(grid, transpose(grid.cols));
    const cols = repCols(grid.cols);
    repPlace(rows);
};