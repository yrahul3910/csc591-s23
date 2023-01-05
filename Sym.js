export default class Sym {
    constructor() {
        this.counts = {};
        this.n = 0;

        this.add = this.add.bind(this);
        this.mid = this.mid.bind(this);
        this.div = this.div.bind(this);
    }

    // Add a new value to the Sym
    add(x) {
        this.n++;
        if (x in this.counts) {
            this.counts[x]++;
        } else {
            this.counts[x] = 1;
        }
    }

    // Return the mode of the Sym
    mid() {
        let max = 0;
        let mode = null;
        for (let key in this.counts) {
            if (this.counts[key] > max) {
                max = this.counts[key];
                mode = key;
            }
        }
        return mode;
    }

    // Return the entropy of the Sym
    div() {
        let sum = 0;
        for (let key in this.counts) {
            let p = this.counts[key] / this.n;
            sum -= p * Math.log2(p);
        }
        return sum;
    }
};