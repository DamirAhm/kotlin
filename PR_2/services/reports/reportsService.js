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

    async addReport(report) {
        const contentHash = this.getContentHash(this.getContentWithoutTimeReport(report));

        const reportName = `report-${contentHash}`;
        const reportPath = this.#getReportPath(reportName);

        if (existsSync(reportPath)) {
            console.log(`Отчет для этих данных уже существует, новый не будет создан, существующий можно посмотреть в файле: ${reportName}`);
        } else {
            await writeFile(reportPath, report);
            console.log(`Создан отчет, его можно посмотреть в файле: ${reportName}`)
        }
    }

    getContentHash(content) {
        return createHash('md5').update(content).digest('hex');
    }

    getContentWithoutTimeReport(content) {
        return content.replace(/Обработка файла заняла:.+миллисекунд/, '')
    }
}