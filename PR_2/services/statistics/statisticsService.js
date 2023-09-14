export class StatisticsService {
    #duplicates = 0;
    #floorStats = {};
    #startTime = 0;
    #endTime = 0;

    #records = {};

    processRecord(record) {
        const {city, street, house, floor} = record;

        if (!this.#records[city]) {
            this.#records[city] = {};
            this.#floorStats[city] = Array.from({length: 5}, () => 0);
        }

        if (!this.#records[city][street]) {
            this.#records[city][street] = {};
        }

        if (this.#records[city][street][house]) {
            this.#duplicates++;
        } else {
            this.#records[city][street][house] = floor;

            this.#floorStats[city][floor - 1]++;
        }
    }

    startReport() {
        this.#startTime = performance.now();
    }

    finishReport() {
        this.#endTime = performance.now();
    }

    get data() {
        return {
            duplicates: this.#duplicates,
            floorStats: this.#floorStats,
            startTime: this.#startTime,
            endTime: this.#endTime
        }
    }

    flushall() {
        this.#floorStats = {};
        this.#records = {};
        this.#duplicates = 0;
        this.#startTime = 0;
        this.#endTime = 0;
    }
}