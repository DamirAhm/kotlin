import { autoInjectable, injectAll, registry } from 'tsyringe';
import { BotController, BotControllerToken } from './controllers/botController';
import { StartController } from './controllers/start/startController';
import VkBot from 'node-vk-bot-api';
import { SystemController } from './controllers/system/systemController';
import { SearchController } from './controllers/search/searchController';
import { EventsController } from './controllers/events/eventsController';

@registry([
	{
		token: BotControllerToken,
		useClass: SystemController,
	},
	{
		token: BotControllerToken,
		useClass: StartController,
	},
	{
		token: BotControllerToken,
		useClass: SearchController,
	},
	{
		token: BotControllerToken,
		useClass: EventsController,
	},
])
@autoInjectable()
export class BotModule {
	constructor(
		@injectAll(BotControllerToken)
		private readonly controllers: BotController[] = [],
	) {}

	async initialize(bot: VkBot) {
		for (const controller of this.controllers) {
			await controller.initHandlers(bot);
		}
	}
}
