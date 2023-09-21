import { injectable } from 'tsyringe';

import { Events } from '../../common/types/events';
import { VkService } from '../vk/vkService';
import { GifsService } from '../gifs/gifsService';
import VkBotMarkup from 'node-vk-bot-api/lib/markup';
import { GifWithLikesAndTagsDto } from './dto/gifWithLikesAndTagsDto';
import { GifEventDto } from '../../controllers/events/gifEventDto';
import { Gif } from '@prisma/client';

@injectable()
export class GifMessageService {
	constructor(
		private readonly vkService: VkService,
		private readonly gifsService: GifsService,
	) {}

	async sendGifMessage(ctx: VkBotContext, gif: GifWithLikesAndTagsDto) {
		let { attachmentString, likes } = gif;

		if (!attachmentString) {
			attachmentString = await this.vkService.makeAttachmentFromUrl(
				gif.url,
				ctx.message.peer_id,
			);

			await this.gifsService.update({
				where: {
					id: gif.id,
				},
				data: {
					attachmentString,
				},
			});
		}

		const isLiked = !!gif.likes.find(
			({ vkId }) => vkId === ctx.message.from_id,
		);

		await ctx.bot.sendMessage(
			ctx.message.peer_id,
			gif.tags.map(({ value }) => value).join(', '),
			attachmentString,
			this.createGifKeyboard({ ...gif, attachmentString }, isLiked),
		);
	}

	createGifKeyboard(gif: GifWithLikesAndTagsDto, isLiked: boolean) {
		const commonPayload: Omit<GifEventDto, 'event'> = {
			id: gif.id,
			attachmentString: gif.attachmentString,
		};

		return VkBotMarkup.keyboard([
			VkBotMarkup.button({
				action: {
					type: 'callback',
					payload: JSON.stringify({
						event: Events.AddTag,
						...commonPayload,
					}),
					label: 'Добавить теги',
				},
				color: 'primary',
			}),
			VkBotMarkup.button({
				action: {
					type: 'callback',
					payload: JSON.stringify({
						event: isLiked ? Events.Dislike : Events.Like,
						...commonPayload,
					}),
					label: isLiked ? `${gif.likes.length} 💔` : `${gif.likes.length} ❤️`,
				},
				color: 'secondary',
			}),
		]).inline();
	}

	async updateGifMessage(
		message: VkBotMessage,
		data: GifEventDto,
		liked: boolean,
	) {
		const gif = await this.gifsService.findById(data.id);

		return this.vkService.updateMessage({
			message: gif?.tags.map(({ value }) => value).join(', '),
			conversation_message_id: message.conversation_message_id,
			//@ts-ignore
			keyboard: this.createGifKeyboard(gif, liked).toJSON(),
			peer_id: message.peer_id,
			attachment: data.attachmentString,
		});
	}
}
