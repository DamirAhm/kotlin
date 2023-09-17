import { Item } from '../types/Item';

export interface IParser {
	parse(filename: string, callback: (item: Item) => void): Promise<void> | void;
}
