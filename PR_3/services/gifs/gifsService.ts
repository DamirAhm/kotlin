import { FindGifsByTagDto } from './dto/findGifsByTagDto';
import { AddToFavoritesDto } from './dto/addToFavoritesDto';
import { RemoveFromFavoritesDto } from './dto/removeFromFavoritesDto';
import { Prisma, PrismaClient } from '@prisma/client';
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

	async findMany(data: Prisma.GifFindManyArgs) {
		return this.db.gif.findMany(data);
	}

	async findGifsByTag(data: FindGifsByTagDto) {
		const res = await this.db.tag.findMany({
			where: data,
			select: {
				gif: true,
			},
		});

		return res.map(({ gif }) => gif);
	}

	async findFavorites(vkId: number) {
		const res = await this.db.user.findUnique({
			where: {
				vkId,
			},
			select: {
				liked: true,
			},
		});

		if (!res) {
			console.log('Пользователь не найден при поиске любимых гифок');

			return [];
		}

		return res.liked;
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
			take: 10,
		});
	}
}
