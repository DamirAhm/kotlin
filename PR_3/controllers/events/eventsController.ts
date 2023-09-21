import { injectable } from 'tsyringe';
import { BotController } from '../botController';
import { GifsService } from '../../services/gifs/gifsService';
import VkBot from 'node-vk-bot-api';
import { GifEventDto } from './gifEventDto';
import { Events } from '../../common/types/events';
import { GifMessageService } from '../../services/messages/gifMessageService';
import { TagsService } from '../../services/tags/tagsService';
import { SceneName } from '../../scenes/sceneName';

@injectable()
export class EventsController extends BotController {
	constructor(
		private readonly gifsService: GifsService,
		private readonly tagsService: TagsService,
		private readonly gifMessageService: GifMessageService,
	) {
		super();
	}

	async initHandlers(bot: VkBot) {
		bot.event('message_event', (ctx, next) => {
			const payload = ctx.message.payload as unknown as GifEventDto;

			switch (payload.event) {
				case Events.Like:
					return this.handleLike(ctx, payload);
				case Events.Dislike:
					return this.handleDislike(ctx, payload);
				case Events.AddTag:
					return this.handleAddTag(ctx, payload);
				default:
					next?.();
			}
		});
	}

	async handleLike(ctx: VkBotContext, data: GifEventDto) {
		await this.gifMessageService.updateGifMessage(ctx.message, data, true);

		await this.gifsService.addToFavorites({
			gifId: data.id,
			vkId: ctx.message.peer_id,
		});
	}

	async handleDislike(ctx: VkBotContext, data: GifEventDto) {
		await this.gifMessageService.updateGifMessage(ctx.message, data, false);

		await this.gifsService.removeFromFavorites({
			gifId: data.id,
			vkId: ctx.message.peer_id,
		});
	}

	async handleAddTag(ctx: VkBotContext, data: GifEventDto) {
		ctx.session.gif = data;
		ctx.reply('Напишите теги через запятую');
		ctx.scene?.enter(SceneName.AddTag);
	}
}
