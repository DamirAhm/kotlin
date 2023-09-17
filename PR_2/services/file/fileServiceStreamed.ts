import { resolve } from 'path';
import { __dirname } from '../../constants';
import { FileService } from './fileService';

const EncodedLineBreak = 10;

export class FileServiceStreamed extends FileService {
	async readByLines(lineCallback: (line: string) => void) {
		if (!this.filePath) {
			return;
		}

		const stream = Bun.file(resolve(__dirname, this.filePath)).stream();

		let buf: number[] = [];

		for await (const chunk of stream) {
			const lines = this.splitChunkIntoLines(chunk);

			const bufWithFirstLine = new Uint8Array([
				...buf,
				...(lines.shift() || []),
			]);
			lineCallback(this.textDecoder.decode(bufWithFirstLine));
			buf = [];

			if (lines.at(-1)) {
				buf = lines.pop()!;
			}

			for (const line of lines) {
				lineCallback(this.textDecoder.decode(new Uint8Array(line)));
			}
		}

		if (buf) {
			lineCallback(this.textDecoder.decode(new Uint8Array(buf)));
		}
	}

	private splitChunkIntoLines(chunk: Uint8Array) {
		return chunk.reduce<number[][]>(
			(acc, cur) => {
				if (cur === EncodedLineBreak) {
					acc.push([]);
				} else {
					acc.at(-1)!.push(cur);
				}

				return acc;
			},
			[[]],
		);
	}
}
