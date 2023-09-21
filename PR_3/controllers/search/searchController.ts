import { injectable } from 'tsyringe';
import { GiphyService } from '../../services/gihpy/giphyService';
import { BotController } from '../botController';
import { VkService } from '../../services/vk/vkService';
import { GifsService } from '../../services/gifs/gifsService';
import VkBot from 'node-vk-bot-api';
import { Events } from '../../common/types/events';
import { Gif } from '@prisma/client';
import { GifMessageService } from '../../services/messages/gifMessageService';

const searchRegExp = /[\/\\]find (.+)/;

@injectable()
export class SearchController extends BotController {
	constructor(
		private readonly giphyService: GiphyService,
		private readonly messagesService: GifMessageService,
	) {
		super();
	}

	async initHandlers(bot: VkBot): Promise<void> {
		//@ts-ignore
		bot.command(searchRegExp, this.handleSearch);
	}

	handleSearch = async (ctx: VkBotContext, next?: () => void) => {
		const [_, query] = ctx.message.text?.match(searchRegExp)!;

		const gifs = await this.giphyService.search(query);

		for (const gif of gifs) {
			await this.messagesService.sendGifMessage(ctx, gif);
		}

		next?.();
	};
}
