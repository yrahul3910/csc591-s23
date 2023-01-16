import { expect } from 'chai';
import Data from './Data';

describe('Data', () => {
    it('loads CSV correctly', () => {
        const data = new Data('auto93.csv');

        expect(data.rows.length).to.equal(398);
        expect(data.cols.x.length).to.equal(4);
        expect(data.cols.x[1].at).to.equal(1);
    });
});