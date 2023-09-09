import axios from 'axios';
import { Agent } from 'node:https';
import {WIKIPEDIA_BASE_URL} from "./constants.js";

export class WikipediaService {
    static #getSearchUrl(search) {
        const queryParams = new URLSearchParams({
            action: 'query',
            list: 'search',
            utf8: '',
            format: 'json',
            srsearch: search
        });

        return `${WIKIPEDIA_BASE_URL}/api.php?${queryParams.toString()}`;
    }

    static getArticleUrl(pageId) {
        const queryParams = new URLSearchParams({
            curid: pageId
        })

        return `${WIKIPEDIA_BASE_URL}/index.php?${queryParams.toString()}`;
    }

    static async makeSearch(search) {
        try {
            const res = await axios.get(this.#getSearchUrl(search), {
                httpsAgent: new Agent({
                    rejectUnauthorized: false,
                })
            })

            return res.data.query.search;
        } catch (e) {
            console.log("При выполнении запроса к википедии произошла ошибка", e);
        }
    }


}