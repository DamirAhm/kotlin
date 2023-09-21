import { Prisma } from '@prisma/client';
import { injectable } from 'tsyringe';
import { DatabaseService } from '../databaseService';
import { VkService } from '../vk/vkService';

@injectable()
export class UsersService {
	constructor(
		private readonly db: DatabaseService,
		private readonly vk: VkService,
	) {}

	async findOrCreateByVkId(vkId: number) {
		const userFromDb = await this.findById(vkId);

		if (userFromDb) {
			console.log('Пользователь уже существует', userFromDb);

			return userFromDb;
		}

		const vkUser = await this.vk?.getUserById(vkId);

		if (vkUser) {
			const user = await this.create({
				vkId: vkUser.id,
				fullName: vkUser.last_name + ' ' + vkUser.first_name,
			});

			console.log('Создан пользователь', user);

			return user;
		}
	}

	findById(id: number) {
		return this.db.user.findUnique({
			where: {
				vkId: id,
			},
			include: {
				tags: true,
				liked: true,
			},
		});
	}

	create(data: Prisma.UserCreateInput) {
		return this.db.user.create({ data });
	}
}
