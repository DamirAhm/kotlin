import { FindGifsByTagDto } from './dto/findGifsByTagDto';
import { AddToFavoritesDto } from './dto/addToFavoritesDto';
import { RemoveFromFavoritesDto } from './dto/removeFromFavoritesDto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../databaseService';
import { injectable } from 'tsyringe';

@injectable()
export class GifsService {
	constructor(private readonly db: DatabaseService) {}

	async update(data: Prisma.GifUpdateArgs) {
		return this.db.gif.update(data);
	}

	async findOrCreate(data: Prisma.GifCreateInput) {
		const gifFromDb = await this.findById(data.id);

		if (gifFromDb) {
			console.log('Гиф уже существует', gifFromDb);

			return gifFromDb;
		}

		const gif = await this.create(data);

		console.log('Создана гиф', gif);

		return gif;
	}

	findById(id: string) {
		return this.db.gif.findUnique({
			where: { id },
			include: {
				likes: true,
				tags: true,
			},
		});
	}

	create(data: Prisma.GifCreateInput) {
		return this.db.gif.create({ data, include: { likes: true, tags: true } });
	}

	findGifsByTag(data: FindGifsByTagDto) {
		return this.db.gif.findMany({
			where: {
				tags: {
					some: {
						value: {
							contains: data.value,
						},
						userId: data.userId,
					},
				},
			},
			include: {
				likes: true,
				tags: true,
			},
		});
	}

	findFavorites(vkId: number) {
		return this.db.gif.findMany({
			where: {
				likes: {
					some: {
						vkId,
					},
				},
			},
			include: {
				tags: true,
				likes: true,
			},
		});
	}

	addToFavorites(data: AddToFavoritesDto) {
		return this.db.gif.update({
			where: {
				id: data.gifId,
			},
			data: {
				likes: {
					connect: {
						vkId: data.vkId,
					},
				},
			},
		});
	}

	removeFromFavorites(data: RemoveFromFavoritesDto) {
		return this.db.gif.update({
			where: {
				id: data.gifId,
			},
			data: {
				likes: {
					disconnect: {
						vkId: data.vkId,
					},
				},
			},
		});
	}

	async findTop() {
		return this.db.gif.findMany({
			orderBy: {
				likes: {
					_count: 'desc',
				},
			},
			include: {
				likes: true,
				tags: true,
			},
			take: 5,
		});
	}
}
