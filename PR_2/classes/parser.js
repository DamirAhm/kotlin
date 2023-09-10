export class Parser {
    async parse(filename, callback) {
        return callback(filename)
    }

    static async getParserByFileExtension(fileExtension, parserParams) {
        switch (fileExtension) {
            case ".xml":
                const {XmlParser} = await import('./xmlParser.js');
                return new XmlParser(parserParams);
            case ".csv":
                const {CsvParser} = await import('./csvParser.js');
                return new CsvParser(parserParams);
            default:
                throw new Error("Неподдерживаемое расширение файла, невозможно обработать")
        }
    }
}