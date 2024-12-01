export const titles = [
	'Daily Tasks',
	'Weekly Tasks',
	'Building a new app with SvelteKit',
	'How to use this application'
];

export const items = titles.map((title, index) => ({
	title,
	url: `/notes/${index + 1}`,
	selected: false
}));
