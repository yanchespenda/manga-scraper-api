import normalize from 'normalize-url';
import matchModule from 'path-match';
import { URL } from 'url';

export default {
	normalizeUrl(url) {
		return normalize(url);
	},

	parseUrl(url) {
		return new URL(this.normalizeUrl(url));
	},

	flatten(arr) {
		return [].concat(...arr);
	},

	uniq(arr) {
		return [...new Set(arr)];
	},

	range(low, high) {
		const result: any = [];
		for (let i = low; i <= high; i++) {
			result.push(i);
		}
		return result;
	},

	isNumber(val) {
		return Boolean(val) && !Number.isNaN(val);
	},

	normalizeJson(input) {
		return input
			.replace(/'/g, '"') // Replace single quotes with double quotes
			.replace(/,]$/, ']'); // Remove trailing slashes
	},

	stripBBCode(input) {
		return input.replace(/\[\/?(?:b|i|u|url|quote|code|img|color|size)*?.*?\]/gim, '');
	},

	extractText(pattern, input, matchIndex = 1) {
		const matches = pattern.exec(input);

		if (!matches) {
			throw new Error(`Could not find matches for ${pattern.toString()}`);
		}

		if (!matches[matchIndex]) {
			throw new Error(`Could not find matches[${matchIndex}] for ${pattern.toString()}`);
		}

		return matches[matchIndex];
	},

	extractJSON(pattern, input) {
		const match = this.extractText(pattern, input);

		try {
			return JSON.parse(this.normalizeJson(match));
		} catch (err) {
			throw new Error('Could not parse JSON');
		}
	},

	pathMatch(url, pattern) {
		const match = matchModule();
		const { pathname } = this.parseUrl(url);
		const pathnameWithTrailingSlash = pathname + '/';
		const matches = match(pattern)(pathnameWithTrailingSlash);

		if (matches === false) {
			return null;
		}

		return matches;
	},

	generateId: (site, series, chapter) => [site, series, chapter].filter(Boolean).join(':'),

	parseId: mangaId => mangaId.split(':'),
};
