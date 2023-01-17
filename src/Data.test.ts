import { expect } from 'chai';
import Data from './Data';
import Num from './Num';
import Sym from './Sym';

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
});