export type FloorStats = Record<string, number[]>;

export type ReportData = {
	duplicates: number;
	floorStats: FloorStats;
	startTime: number;
	endTime: number;
};
