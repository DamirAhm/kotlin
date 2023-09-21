import { Gif, Tag, User } from '@prisma/client';

export type GifWithLikesAndTagsDto = Gif & {
	likes: User[];
	tags: Tag[];
};
