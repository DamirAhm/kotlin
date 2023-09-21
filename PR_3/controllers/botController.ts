import VkBot from 'node-vk-bot-api';

export const BotControllerToken = 'BOT_CONTROLLER_TOKEN';

export abstract class BotController {
	abstract initHandlers(bot: VkBot): Promise<void>;
}
