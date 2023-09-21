import { VkResponse } from '../../../common/types/vkResponse';

export type SaveFileResponseDto = VkResponse<{
	doc: VkBotDoc;
}>;
