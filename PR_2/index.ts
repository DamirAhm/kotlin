import { StatisticsService } from './services/statistics/statisticsService';
import path from 'path';
import { ReportsService } from './services/reports/reportsService';
import { __dirname } from './constants';
import { Parser } from './classes/parser';
import inquirer from 'inquirer';
import { FileServiceStreamed } from './services/file/fileServiceStreamed';

(async () => {
	console.log('Чтобы досрочно завершить выполнение программы нажмите ctrl + C');

	while (true) {
		try {
			const { filename } = await inquirer.prompt([
				{
					type: 'input',
					name: 'filename',
					message: 'Какой файл вы хотите обработать?',
				},
			]);
			const fileExtension = path.extname(filename);

			const statisticsService = new StatisticsService();
			const reportsService = new ReportsService(
				path.resolve(__dirname, 'reports'),
			);

			const parser = await Parser.getParserByFileExtension(
				fileExtension,
				// FileServiceStreamed,
			);

			statisticsService.startReport();

			await parser.parse('inputFiles/' + filename, (record) => {
				statisticsService.processRecord(record);
			});

			statisticsService.finishReport();

			const data = statisticsService.data;

			console.log(
				`Обработка заняла ${Math.floor(
					data.endTime - data.startTime,
				)} миллисекунд`,
			);

			await reportsService.addReport(data);

			statisticsService.flushall();
		} catch (e) {
			console.log('Во время выполнения програмы произошла ошибка', e);
		}
	}
})();
