import { VkResponse } from '../../../common/types/vkResponse';

export type GetUserResponseDto = VkResponse<
	{
		id: number;
		first_name: string;
		last_name: string;
	}[]
>;
