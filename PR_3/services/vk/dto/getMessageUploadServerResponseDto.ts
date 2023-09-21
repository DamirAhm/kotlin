import { VkResponse } from '../../../common/types/vkResponse';

export type GetMessageUploadServerResponseDto = VkResponse<{
	upload_url: string;
}>;
