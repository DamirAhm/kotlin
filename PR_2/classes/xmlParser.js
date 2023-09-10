import {Parser} from "./parser.js";
import { parseStringPromise } from "xml2js";
import {FileService} from "../services/file/fileService.js";

export class XmlParser extends Parser {
    itemField = 'item';

    constructor({itemField} = {}) {
        super();

        this.itemField = itemField || this.itemField;
    }

    async parse(filename, callback) {
        const fileService = new FileService(filename);

        await fileService.init();

        await fileService.readByLines( async (line) => {
            try {
                const record = await parseStringPromise(line);

                if (record[this.itemField]) {
                    callback(record[this.itemField].$);
                }
            } catch (err) {}
        })

        await fileService.destroy();
    }
}