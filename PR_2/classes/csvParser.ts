import { FileService } from '../services/file/fileService.js';
import { Item } from '../types/Item';
import { IParser } from '../interfaces/IParser';

export class CsvParser implements IParser {
	delimiter = ';';
	fileService: typeof FileService;

	constructor(fileService: typeof FileService) {
		this.fileService = fileService;
	}

	async parse(filename: string, callback: (item: Item) => void) {
		const fileService = new this.fileService(filename);

		let readHeader = false;

		await fileService.readByLines(async (line) => {
			try {
				if (!readHeader) {
					readHeader = true;
				} else {
					const [city, street, house, floor] = line.split(this.delimiter);

					callback({
						city: city.slice(1, -1),
						street: street.slice(1, -1),
						house: parseInt(house),
						floor: parseInt(floor),
					});
				}
			} catch (err) {}
		});
	}
}
