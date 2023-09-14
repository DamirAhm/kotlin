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

        await fileService.readByLines( async (line) => {
            try {
                const [city, street, house, floor] = line.split(this.delimiter);

                callback({
                    city: city.slice(1, -1),
                    street: street.slice(1, -1),
                    house: parseInt(house),
                    floor: parseInt(floor)
                });
            } catch (err) {}
        })
    }
}