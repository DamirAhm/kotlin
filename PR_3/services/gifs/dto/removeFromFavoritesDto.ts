import { Gif, User } from '@prisma/client';

export type RemoveFromFavoritesDto = {
	vkId: User['vkId'];
	gifId: Gif['id'];
};
