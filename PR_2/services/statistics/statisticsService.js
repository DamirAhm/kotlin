export class StatisticsService {
    duplicates = 0;
    floorStats = {};
    startTime = 0;

    records = {}

    processRecord(record) {
        const {city, street, house, floor} = record;

        if (!this.records[city]) {
            this.records[city] = {};
            this.floorStats[city] = Array.from({length: 5}, () => 0);
        }

        if (!this.records[city][street]) {
            this.records[city][street] = {};
        }

        if (this.records[city][street][house]) {
            this.duplicates++;
        } else {
            this.records[city][street][house] = floor;

            this.floorStats[city][floor - 1]++;
        }
    }

    startReport() {
        this.startTime = performance.now();
    }

    createReport() {
        const endTime = performance.now();

        const timeReport = `Обработка файла заняла: ${endTime - this.startTime} миллисекунд`;
        const duplicatesReport = `Количество дупликатов: ${this.duplicates}`
        const floorReport = this.#createFullFloorReport();

        return [timeReport, duplicatesReport, floorReport].join('\n');
    }

    #createCityFloorReport = (city) => {
        if (!this.floorStats[city]) {
            throw new Error(`Попытка построить отчет по этажности зданий для несуществующего города: ${city}`);
        }

        return this.floorStats[city].map((val, i) => `Количество ${i+1}-этажных зданий: ${val + 1}`);
    }

    #createFullFloorReport = () => {
        const cities = Object.getOwnPropertyNames(this.floorStats);

        return cities.map((city) => {
            const cityFloorReport = this.#createCityFloorReport(city)
                .map((floorReport) => `\t${floorReport}`)
                .join('\n');

            return `Отчет по этажности зданий в городе ${city}:\n${cityFloorReport}`;
        }).join('\n');
    }

    flushall() {
        this.floorStats = {};
        this.records = {};
        this.duplicates = 0;
        this.startTime = 0;
    }
}