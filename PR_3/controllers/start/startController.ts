import { UsersService } from '../../services/users/usersService';
import { VkService } from '../../services/vk/vkService';
import VkBot from 'node-vk-bot-api';
import { autoInjectable } from 'tsyringe';
import { BotController } from '../botController';

@autoInjectable()
export class StartController extends BotController {
	constructor(
		private readonly usersService?: UsersService,
		private readonly vkService?: VkService,
	) {
		super();
	}

	async initHandlers(bot: VkBot) {
		bot.command('Начать', this.handleStart);
	}

	handleStart = async (ctx: VkBotContext, next?: () => void) => {
		console.log(ctx);
		console.log('Вызвана команда начать');

		const user = await this.usersService?.findOrCreateByVkId(
			ctx.message.from_id,
		);

		if (user) {
			ctx.session.user = user;

			ctx.reply(this.getHelpText(user.fullName));
		}

		next?.();
	};

	getHelpText(fullName: string) {
		return [
			`Привет ${fullName}, с помощью этого бота ты сможешь найти и сохранить себе самые смешные гифочки`,
			'Напиши /find {запрос}, чтобы найти гифку по запросу',
		].join('\n\n');
	}
}
