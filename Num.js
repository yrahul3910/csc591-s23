export default class Num {
    constructor() {
        this.count = 0;
        this.m2 = 0;
        this.sum = 0;

        this.add = this.add.bind(this);
        this.mid = this.mid.bind(this);
        this.div = this.div.bind(this);
    }

    // Add a new value to the Num
    add(x) {
        this.count++;
        this.sum += x;

        // Welford's online algorithm
        let delta = x - this.mid();
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