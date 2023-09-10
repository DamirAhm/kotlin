import {open} from "node:fs/promises";
import {resolve} from "node:path";
import {__dirname} from "../../constants.js";
import readline from "readline";

export class FileService {
    #filePath = null;
    #fileHandle = null;
    #fileStream = null;

    constructor(filePath) {
        this.#filePath = filePath;
    }

    async init() {
        this.#fileHandle = await open(resolve(__dirname, this.#filePath))
        this.#fileStream = this.#fileHandle.createReadStream();
    }

    async destroy() {
        await this.#fileHandle.close();
    }

    async readByLines(lineCallback) {
        if (!this.#fileStream) {
            throw new Error('Перед чтением файла инициализируйте сервис');
        }

        const rl = readline.createInterface({
            input: this.#fileStream,
            crlfDelay: Infinity
        })

        for await (const line of rl) {
            lineCallback(line);
        }
    }
}