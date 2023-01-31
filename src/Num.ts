export default class Num {
    count: number;
    m2: number;
    sum: number;
    at: number;
    txt: string;
    w: number;
    lo: number;
    hi: number;

    constructor(at=0, txt='') {
        this.count = 0;
        this.m2 = 0;
        this.sum = 0;
        this.lo = Infinity;
        this.hi = -Infinity;

        this.at = at;
        this.txt = txt;

        if (this.txt[this.txt.length - 1] === '-') {
            this.w = -1;
        } else {
            this.w = 1;
        }

        this.add = this.add.bind(this);
        this.mid = this.mid.bind(this);
        this.div = this.div.bind(this);
        this.dist = this.dist.bind(this);
    }

    // Add a new value to the Num
    add(x: number | string) {
        if (x == '?') return;

        x = x as number;

        this.count++;
        this.sum += x;

        this.lo = Math.min(this.lo, x);
        this.hi = Math.max(this.hi, x);

        // Welford's online algorithm
        const delta = x - this.mid();
        this.m2 += delta * (x - this.mid());
    }

    // Return the mean of the num
    mid() {
        if (this.count === 0) return 0;
        return this.sum / this.count;
    }

    // Return the standard deviation of the num
    div() {
        if (this.count < 2) return 0;
        return Math.sqrt(this.m2 / (this.count - 1));
    }

    // Normalize a number
    norm(n: number | '?') {
        const epsilon = 1e-32;
        if (n === '?') return n;
        return (n - this.lo) / (this.hi - this.lo + epsilon);
    }

    // Distance function
    dist(n1: number | '?', n2: number | '?') {
        if (n1 === '?' && n2 === '?') return 1;
        n1 = this.norm(n1);
        n2 = this.norm(n2);

        if (n1 === '?') {
            if (n2 < 0.5) n1 = 1;
            else n1 = 0;
        }

        if (n2 === '?') {
            if (n1 < 0.5) n2 = 1;
            else n2 = 0;
        }

        return Math.abs(n1 - n2);
    }
}