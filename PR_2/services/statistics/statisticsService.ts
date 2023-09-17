import { Item } from '../../types/Item';
import { FloorStats, ReportData } from '../../types/reportData';

type RecordsType = Record<string, Record<string, Record<string, number>>>;

export class StatisticsService {
	private duplicates = 0;
	private floorStats: FloorStats = {};
	private startTime = 0;
	private endTime = 0;

	private records: RecordsType = {};

	processRecord(item: Item) {
		const { city, street, house, floor } = item;

		if (!this.records[city]) {
			this.records[city] = {};
			this.floorStats[city] = Array.from({ length: 5 }, () => 0);
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

	finishReport() {
		this.endTime = performance.now();
	}

	get data(): ReportData {
		return {
			duplicates: this.duplicates,
			floorStats: this.floorStats,
			startTime: this.startTime,
			endTime: this.endTime,
		};
	}

	flushall() {
		this.floorStats = {};
		this.records = {};
		this.duplicates = 0;
		this.startTime = 0;
		this.endTime = 0;
	}
}
