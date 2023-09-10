import {Parser} from "./parser.js";
import { parse } from 'csv-parse';
import {FileService} from "../services/file/fileService.js";

export class CsvParser extends Parser {
    delimiter = ';';

    constructor({delimiter} = {}) {
        super();

        this.delimiter = delimiter || this.delimiter;
    }

    async parse(filename, callback) {
        const fileService = new FileService(filename);

        await fileService.init();

        const parser = parse({
            delimiter: this.delimiter,
            cast: true,
            onRecord: record => callback(record),
            columns: true
        })

        parser.on('error', (err) => {
            console.error("Ошибка в Csv парсере: ", err.message);
        });

        parser.on('end', () => {
            fileService.destroy();
        })

        await fileService.readByLines( async (line) => {
            try {
                parser.write(line + "\n");
            } catch (err) {}
        })

        await parser.end();
    }
}