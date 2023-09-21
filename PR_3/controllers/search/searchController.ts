import { injectable } from 'tsyringe';
import { GiphyService } from '../../services/gihpy/giphyService';
import { BotController } from '../botController';
import { GifsService } from '../../services/gifs/gifsService';
import VkBot from 'node-vk-bot-api';
import { GifMessageService } from '../../services/messages/gifMessageService';

const searchRegExp = /[\/\\]find ([^-]+)( - \d+)?$/;

@injectable()
export class SearchController extends BotController {
	constructor(
		private readonly giphyService: GiphyService,
		private readonly messagesService: GifMessageService,
		private readonly gifsService: GifsService,
	) {
		super();
	}

	async initHandlers(bot: VkBot): Promise<void> {
		//@ts-ignore
		bot.command(searchRegExp, this.handleSearch);
		bot.command('/favorites', this.handleFavorites);
		bot.command('/top', this.handleTop);
	}

	handleSearch = async (ctx: VkBotContext, next?: () => void) => {
		const [_, query, limitString] = ctx.message.text?.match(searchRegExp)!;

		const tagged = await this.gifsService.findGifsByTag({
			value: query,
			userId: ctx.message.peer_id,
		});

		const limit = limitString ? parseInt(limitString.slice(3)) : 5;

		const gifs = await this.giphyService.search(
			query,
			Math.max(0, limit - tagged.length),
		);

		for (const gif of tagged.concat(gifs)) {
			await this.messagesService.sendGifMessage(ctx, gif);
		}

		next?.();
	};

	handleFavorites = async (ctx: VkBotContext, next?: () => void) => {
		const favorites = await this.gifsService.findFavorites(ctx.message.peer_id);

		for (const favorite of favorites) {
			await this.messagesService.sendGifMessage(ctx, favorite);
		}
	};

	handleTop = async (ctx: VkBotContext, next?: () => void) => {
		const top = await this.gifsService.findTop();

		for (const gif of top) {
			await this.messagesService.sendGifMessage(ctx, gif);
		}
	};
}
