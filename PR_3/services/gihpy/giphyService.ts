import { injectable } from 'tsyringe';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { GifsService } from '../gifs/gifsService';
import { Prisma } from '@prisma/client';
import { VkService } from '../vk/vkService';

@injectable()
export class GiphyService {
	private fetchClient: GiphyFetch;

	constructor(
		private readonly gifService: GifsService,
		private readonly vkService: VkService,
	) {
		this.fetchClient = new GiphyFetch(process.env.GIPHY_API_KEY!);
	}

	async search(query: string) {
		const { data } = await this.fetchClient.search(query, {
			limit: 5,
		});

		return Promise.all(
			data.map(
				async ({
					id,
					images: {
						original: { url },
					},
				}) => {
					return await this.gifService.findOrCreate({
						id: id.toString(),
						url,
					});
				},
			),
		);
	}
}
