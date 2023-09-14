import { createHash } from "node:crypto";
import {mkdirSync, existsSync } from 'node:fs';
import path from "node:path";
import {writeFile} from "node:fs/promises";

export class ReportsService {
    reportsDir = null;

    constructor(dir) {
        this.reportsDir = dir;

        if (!existsSync(dir)) {
            console.log("Директория для отчетов не существует, соответствующая папка будет создана");

            mkdirSync(dir);
        }
    }

    #getReportPath(reportName) {
        return path.resolve(this.reportsDir, reportName);
    }

    async addReport(data) {
        const timeReport = this.#createTimeReport(data);
        const report = this.#createReport(data);

        const contentHash = this.getContentHash(report);

        const reportName = `report-${contentHash}`;
        const reportPath = this.#getReportPath(reportName);

        if (existsSync(reportPath)) {
            console.log(`Отчет для этих данных уже существует, новый не будет создан, существующий можно посмотреть в файле: ${reportName}`);
        } else {
            await writeFile(reportPath, `${timeReport}\n${report}`);
            console.log(`Создан отчет, его можно посмотреть в файле: ${reportName}`)
        }
    }

    getContentHash(content) {
        return createHash('md5').update(content).digest('hex');
    }

    #createTimeReport(data) {
        return `Обработка файла заняла: ${data.endTime - data.startTime} миллисекунд`;
    }

    #createReport(data) {
        const duplicatesReport = `Количество дупликатов: ${data.duplicates}`
        const floorReport = this.#createFullFloorReport(data.floorStats);

        return [duplicatesReport, floorReport].join('\n');
    }

    #createCityFloorReport = (floorStats, city) => {
        if (!floorStats[city]) {
            throw new Error(`Попытка построить отчет по этажности зданий для несуществующего города: ${city}`);
        }

        return floorStats[city].map((val, i) => `Количество ${i+1}-этажных зданий: ${val + 1}`);
    }

    #createFullFloorReport = (floorStats) => {
        const cities = Object.getOwnPropertyNames(floorStats);

        return cities.map((city) => {
            const cityFloorReport = this.#createCityFloorReport(floorStats, city)
                .map((floorReport) => `\t${floorReport}`)
                .join('\n');

            return `Отчет по этажности зданий в городе ${city}:\n${cityFloorReport}`;
        }).join('\n');
    }
}