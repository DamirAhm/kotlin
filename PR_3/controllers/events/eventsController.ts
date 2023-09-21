import { injectable } from 'tsyringe';
import { BotController } from '../botController';
import { GifsService } from '../../services/gifs/gifsService';
import VkBot from 'node-vk-bot-api';
import { GifEventDto } from './gifEventDto';
import { Events } from '../../common/types/events';
import { GifMessageService } from '../../services/messages/gifMessageService';
import { TagsService } from '../../services/tags/tagsService';
import { VkService } from '../../services/vk/vkService';

@injectable()
export class EventsController extends BotController {
	constructor(
		private readonly gifsService: GifsService,
		private readonly gifMessageService: GifMessageService,
		private readonly tagsService: TagsService,
		private readonly vkService: VkService,
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

		//@ts-ignore
		bot.command(/.+/, this.handleTags);
	}

	async handleLike(ctx: VkBotContext, data: GifEventDto) {
		try {
			await this.vkService.answerEvent(ctx.message);
			await this.gifsService.addToFavorites({
				gifId: data.id,
				vkId: ctx.message.peer_id,
			});

			await this.gifMessageService.updateGifMessage(ctx.message, data, true);
		} catch (e) {}
	}

	async handleDislike(ctx: VkBotContext, data: GifEventDto) {
		try {
			await this.vkService.answerEvent(ctx.message);
			await this.gifsService.removeFromFavorites({
				gifId: data.id,
				vkId: ctx.message.peer_id,
			});

			await this.gifMessageService.updateGifMessage(ctx.message, data, false);
		} catch (e) {}
	}

	async handleAddTag(ctx: VkBotContext, data: GifEventDto) {
		try {
			await this.vkService.answerEvent({
				//@ts-ignore
				user_id: ctx.message.user_id,
				peer_id: ctx.message.peer_id,
				//@ts-ignore
				event_id: ctx.message.event_id,
			});

			ctx.session.gif = data;
			ctx.reply('Напишите теги через запятую');
		} catch (e) {}
	}

	handleTags = async (ctx: VkBotContext, next?: () => void) => {
		if ('gif' in ctx.session) {
			const tags = ctx.message.text?.split(',').map((tag) => tag.trim());

			if (tags) {
				await this.tagsService.addTags({
					tags,
					vkId: ctx.message.peer_id,
					gifId: ctx.session.gif.id,
				});

				delete ctx.session.gif;
				ctx.reply('Теги добавлены');
			} else {
				ctx.reply('Я же нормально сказал введи теги через запятую как человек');
			}
		}
	};
}
