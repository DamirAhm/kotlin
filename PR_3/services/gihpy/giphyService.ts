import { injectable } from 'tsyringe';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { GifsService } from '../gifs/gifsService';

@injectable()
export class GiphyService {
	private fetchClient: GiphyFetch;

	constructor(private readonly gifService: GifsService) {
		this.fetchClient = new GiphyFetch(process.env.GIPHY_API_KEY!);
	}

	async search(query: string, limit = 5) {
		const { data } = await this.fetchClient.search(query, {
			limit,
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
