import '@abraham/reflection';
import VkBot from 'node-vk-bot-api';
import Session from 'node-vk-bot-api/lib/session';
import { BotModule } from './botModule';

(async () => {
	const bot = new VkBot({
		token: process.env.VK_COMMUNITY_TOKEN!,
		group_id: parseInt(process.env.GROUP_ID!),
		polling_timeout: 1,
	});

	const session = new Session();

	bot.use(session.middleware());

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
