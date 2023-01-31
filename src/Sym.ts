export default class Sym {
    counts: {[x: string]: number};
    n: number;
    at: number;
    txt: string;

    constructor(at=0, txt='') {
        this.counts = {};
        this.n = 0;

        this.at = at;
        this.txt = txt;

        this.add = this.add.bind(this);
        this.mid = this.mid.bind(this);
        this.div = this.div.bind(this);
    }

    // Add a new value to the Sym
    add(x: string | number) {
        if (x == '?') return;

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
        for (const key in this.counts) {
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
        for (const key in this.counts) {
            const p = this.counts[key] / this.n;
            sum -= p * Math.log2(p);
        }
        return sum;
    }

    // Compute the distance
    dist(s1: number | string, s2: number | string) {
        if (typeof s1 === 'number' || typeof s2 === 'number') {
            throw new Error('Cannot compute distance between numbers');
        }

        if ((s1 === s2) && (s1 !== '?')) return 0;
        return 1;
    }
}