import { BotController } from '../botController';
import { injectable } from 'tsyringe';

@injectable()
export class SystemController extends BotController {
	async initHandlers(bot: VkBot): Promise<void> {
		bot.use(async (ctx, next) => {
			if (Math.abs(ctx.message.date * 1000 - Date.now()) > 1000 * 60) {
				return;
			}

			try {
				await next?.();
			} catch (e) {
				console.error('ERROR', e);
			}
		});
	}
}
