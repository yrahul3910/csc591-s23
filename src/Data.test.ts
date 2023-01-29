import { expect } from 'chai';
import Data from './Data';
import Num from './Num';
import Sym from './Sym';
import Row from './Row';

describe('Data', () => {
    it('loads CSV correctly', () => {
        const data = new Data('auto93.csv');

        expect(data.rows.length).to.equal(398);
        expect(data.cols.x.length).to.equal(4);
        expect(data.cols.x[1].at).to.equal(1);
    });

    it('detects types correctly', () => {
        const data = new Data('auto93.csv');

        expect(data.cols.x[0]).to.be.instanceOf(Num);
        expect(data.cols.x[3]).to.be.instanceOf(Sym);
    });

    it('should clone correctly', () => {
        const data = new Data('auto93.csv');
        const clone = data._clone(data.rows);

        expect(clone.rows.length).to.equal(data.rows.length);
        expect(clone.cols.y[1].w).to.equal(data.cols.y[1].w);
        expect(clone.cols.x.length).to.equal(data.cols.x.length);
    });

    it('performs 1-level bi-clustering', () => {
        const data = new Data('auto93.csv');

        let [left, right, A, B,] = data.half(data.rows, data.cols, null);
        left = left as Row[];
        right = right as Row[];

        expect(left.length + right.length).to.equal(data.rows.length);
    });
});