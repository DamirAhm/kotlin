import {Parser} from "./parser.js";
import { parseStringPromise } from "xml2js";
import {FileService} from "../services/file/fileService.js";

const itemRegExp = /<item city="(.+)" street="(.+)" house="(.+)" floor="(.+)" \/>/

export class XmlParser extends Parser {
    async parse(filename, callback) {
        const fileService = new FileService(filename);

        await fileService.init();

        await fileService.readByLines( async (line) => {
            try {
                if (itemRegExp.test(line)) {
                    const [_, city, street, house, floor] = line.match(itemRegExp);

                    callback({
                        city,
                        street,
                        house: parseInt(house),
                        floor: parseInt(floor),
                    })
                }
            } catch (err) {}
        })

        await fileService.destroy();
    }
}

/*
{
    item: {
        $: { city, street, house, floor }
    }
}
*/