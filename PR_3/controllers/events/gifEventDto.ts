import { Gif, Tag, User } from '@prisma/client';
import { Events } from '../../common/types/events';

export type GifEventDto = {
	event: Events;
	id: Gif['id'];
	attachmentString: string | null;
};
