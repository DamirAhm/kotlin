import { XmlParser } from './xmlParser';
import { CsvParser } from './csvParser';
import { FileService } from '../services/file/fileService';

export class Parser {
	static async getParserByFileExtension(
		fileExtension: string,
		fileService: typeof FileService = FileService,
	) {
		switch (fileExtension) {
			case '.xml':
				return new XmlParser(fileService);
			case '.csv':
				return new CsvParser(fileService);
			default:
				throw new Error(
					'Неподдерживаемое расширение файла, невозможно обработать',
				);
		}
	}
}
