import { resolve } from 'path';
import { __dirname } from '../../constants.js';

export class FileService {
	protected readonly filePath: string | null = null;
	protected readonly textDecoder: TextDecoder;

	constructor(filePath: string) {
		this.filePath = filePath;
		this.textDecoder = new TextDecoder();
	}

	async readByLines(lineCallback: (line: string) => void) {
		if (!this.filePath) {
			return;
		}

		const fileContent = await Bun.file(
			resolve(__dirname, this.filePath),
		).text();

		for (const line of fileContent.split('\n')) {
			lineCallback(line);
		}
	}
}
