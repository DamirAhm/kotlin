import { Prisma, PrismaClient } from '@prisma/client';
import { DatabaseService } from '../databaseService';
import { injectable } from 'tsyringe';
import { AddTagsDto } from './dto/addTagsDto';

@injectable()
export class TagsService {
	constructor(private readonly db: DatabaseService) {}

	addTags({ tags, gifId, vkId }: AddTagsDto) {
		return this.db.tag.createMany({
			data: tags.map((tag) => ({
				value: tag,
				userId: vkId,
				gifId,
			})),
			skipDuplicates: true,
		});
	}

	removeTags({ tags, gifId, vkId }: AddTagsDto) {
		return this.db.tag.deleteMany({
			where: {
				gifId,
				userId: vkId,
				value: {
					in: tags,
				},
			},
		});
	}

	deleteById(id: number) {
		return this.db.tag.delete({
			where: {
				id,
			},
		});
	}
}
