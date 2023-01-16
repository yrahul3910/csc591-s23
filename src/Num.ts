export default class Num {
    count: number;
    m2: number;
    sum: number;
    at: number;
    txt: string;
    w: number;

    constructor(at=0, txt='') {
        this.count = 0;
        this.m2 = 0;
        this.sum = 0;

        this.at = at;
        this.txt = txt;

        if (/-$/.test(this.txt)) {
            this.w = -1;
        } else {
            this.w = 1;
        }

        this.add = this.add.bind(this);
        this.mid = this.mid.bind(this);
        this.div = this.div.bind(this);
    }

    // Add a new value to the Num
    add(x: number | string) {
        if (x == '?') return;
        if (typeof(x) === 'string') return;

        this.count++;
        this.sum += x;

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
}