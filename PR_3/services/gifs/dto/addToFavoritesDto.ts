import { Gif, User } from '@prisma/client';

export type AddToFavoritesDto = {
	vkId: User['vkId'];
	gifId: Gif['id'];
};
