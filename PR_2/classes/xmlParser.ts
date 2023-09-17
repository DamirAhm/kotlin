import { FileService } from '../services/file/fileService.js';
import { Item } from '../types/Item';
import { IParser } from '../interfaces/IParser';

const itemRegExp =
	/<item city="(.+)" street="(.+)" house="(.+)" floor="(.+)" \/>/;

export class XmlParser implements IParser {
	private readonly fileService;

	constructor(fileService: typeof FileService) {
		this.fileService = fileService;
	}

	async parse(filename: string, callback: (item: Item) => void) {
		const fileService = new this.fileService(filename);

		await fileService.readByLines(async (line) => {
			try {
				if (itemRegExp.test(line)) {
					const [_, city, street, house, floor] = line.match(itemRegExp)!;

					callback({
						city,
						street,
						house: parseInt(house),
						floor: parseInt(floor),
					});
				}
			} catch (err) {}
		});
	}
}

/*
{
    item: {
        $: { city, street, house, floor }
    }
}
*/
