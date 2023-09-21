import VkBot from 'node-vk-bot-api';

export const BotSceneToken = 'BOT_SCENE_TOKEN';

export abstract class BotScene {
	abstract getScene(bot: VkBot): VkBotScene | Promise<VkBotScene>;
}
