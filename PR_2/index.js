import { StatisticsService } from "./services/statistics/statisticsService.js";
import path from "node:path";
import {ReportsService} from "./services/reports/reportsService.js";
import { __dirname } from "./constants.js";
import {Parser} from "./classes/parser.js";
import inquirer from "inquirer";
import { readFile } from "fs/promises";
import {parseStringPromise} from "xml2js";

(async () => {
    console.log("Чтобы досрочно завершить выполнение программы нажмите ctrl + C");

    while (true) {
        const {filename} = await inquirer.prompt([{
            type: "input",
            name: "filename",
            message: "Какой файл вы хотите обработать?"
        }]);
        const fileExtension = path.extname(filename);

        const statisticsService = new StatisticsService();
        const reportsService = new ReportsService(path.resolve(__dirname, 'reports'));

        const parser = await Parser.getParserByFileExtension(fileExtension);

        statisticsService.startReport();

        await parser.parse("inputFiles/" + filename, (record) => {
            statisticsService.processRecord(record);
        });

        const report = statisticsService.createReport();

        console.log(report.split("\n")[0]);

        await reportsService.addReport(report);

        statisticsService.flushall();
    }
})()