import { injectable } from 'tsyringe';
import { BotScene } from './botScene';
import Scene from 'node-vk-bot-api/lib/scene';
import { SceneName } from './sceneName';

@injectable()
export class AddTagScene extends BotScene {
	getScene(bot: VkBot): VkBotScene | Promise<VkBotScene> {
		return new Scene(SceneName.AddTag, (ctx) => {
			const tags = ctx.message.text?.split(',');

			if (tags) {
			} else {
				ctx.scene?.enter(SceneName.AddTag);
				ctx.reply('Я же нормально сказал введи теги через запятую как человек');
			}
		});
	}
}
