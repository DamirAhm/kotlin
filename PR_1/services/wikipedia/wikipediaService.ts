import axios from 'axios';
import { WIKIPEDIA_BASE_URL } from './constants.js';
import { PageType } from './types/pageType';
import { SearchType } from './types/searchType';

export class WikipediaService {
	private static getSearchUrl(search: string): string {
		const queryParams = new URLSearchParams({
			action: 'query',
			list: 'search',
			utf8: '',
			format: 'json',
			srsearch: search,
		});

		return `${WIKIPEDIA_BASE_URL}/api.php?${queryParams.toString()}`;
	}

	static getArticleUrl(pageId: number): string {
		const queryParams = new URLSearchParams({
			curid: pageId.toString(),
		});

		return `${WIKIPEDIA_BASE_URL}/index.php?${queryParams.toString()}`;
	}

	static async makeSearch(search: string): Promise<PageType[]> {
		try {
			const res = await axios.get<SearchType>(this.getSearchUrl(search));

			return res.data.query.search;
		} catch (e) {
			console.log('При выполнении запроса к википедии произошла ошибка', e);

			return [];
		}
	}
}
