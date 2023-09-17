import { WikipediaService } from './services/wikipedia/wikipediaService.js';
import open from 'open';
import inquirer from 'inquirer';

(async () => {
	const { search } = await inquirer.prompt([
		{
			type: 'input',
			name: 'search',
			message: 'Что вы хотите найти на википедии?',
		},
	]);

	const searchResults = await WikipediaService.makeSearch(search);

	if (searchResults.length === 0) {
		console.log(
			'К сожалению по вашему запросу не найдено ни одной страницы на википедии',
		);

		return;
	}

	const { selectedOption } = await inquirer.prompt([
		{
			type: 'list',
			name: 'selectedOption',
			message: 'На какую страницу вы хотите попасть?',
			choices: searchResults.map(({ title }) => title),
		},
	]);

	const selectedItem = searchResults.find(
		({ title }) => title === selectedOption,
	);

	if (selectedItem) {
		await open(WikipediaService.getArticleUrl(selectedItem.pageid));
	} else {
		console.log(
			'Во время выполнения программы произошла ошибка, выбрана несуществующий вариант ответа',
		);
	}
})();
