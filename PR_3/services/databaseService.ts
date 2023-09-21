import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';

@injectable()
export class DatabaseService {
	readonly client: PrismaClient;

	constructor() {
		this.client = new PrismaClient();
	}

	get user() {
		return this.client.user;
	}

	get tag() {
		return this.client.tag;
	}

	get gif() {
		return this.client.gif;
	}
}
