import Num from './Num';
import { expect } from 'chai';

describe('Num', () => {
    const nums = [1, 1, 1, 1, 2, 2, 3];

    it('should return the mean of the num', () => {
        let num = new Num();

        nums.forEach(num.add);
        const mean = num.mid();

        expect(mean).to.equal(11 / 7);
    });

    it('should return the standard deviation of the num', () => {
        let num = new Num();

        nums.forEach(num.add);
        const std = num.div();

        expect(std - 0.787).to.be.below(0.001);
    });
});