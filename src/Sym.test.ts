import Sym from './Sym';
import { expect } from 'chai';

describe('Sym', () => {
    const syms = ['a', 'a', 'a', 'a', 'b', 'b', 'c'];

    it('should return the mode of the sym', () => {
        const sym = new Sym();

        syms.forEach(sym.add);
        const mode = sym.mid();

        expect(mode).to.equal('a');
    });

    it('should return the entropy of the sym', () => {
        const sym = new Sym();

        syms.forEach(sym.add);
        const entropy = sym.div();

        expect(entropy - 1.459).to.be.below(0.001);
    });
});