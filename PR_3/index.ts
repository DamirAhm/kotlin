import '@abraham/reflection';
import VkBot from 'node-vk-bot-api';
import Session from 'node-vk-bot-api/lib/session';
import { PrismaClient } from '@prisma/client';
import { BotModule } from './botModule';
import { GiphyService } from './services/gihpy/giphyService';
import { GifsService } from './services/gifs/gifsService';
import { DatabaseService } from './services/databaseService';
import { VkService } from './services/vk/vkService';

(async () => {
	const db = new PrismaClient();

	const bot = new VkBot({
		token: process.env.VK_COMMUNITY_TOKEN!,
		group_id: parseInt(process.env.GROUP_ID!),
		polling_timeout: 1,
	});

	const session = new Session();
	// const stage = new Stage([]);
	bot.use(session.middleware());
	// bot.use(stage.middleware());

	const botModule = new BotModule();

	await botModule.initialize(bot);

	bot.startPolling((err) => {
		if (err) {
			console.log({ ...err });
		}

		return {};
	});

	console.log('Бот начал слушать сообщения');
})();
