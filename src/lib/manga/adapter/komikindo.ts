import cheerio from 'cheerio';
import validator from 'validator';
import queryString from 'query-string';
import { get } from '../get';
import utils from '../utils';

const KomikindoAdapter = {
	id: 'komikindo',
	name: 'Komikindo',

	supportsUrl(url) {
		return /^https?:\/\/(www\.)?komikindo.web.id/.test(url);
	},

	supportsReading() {
		return true;
	},

	_getHost() {
		return `https://komikindo.web.id/`;
	},

	patternChapter(url) {
		return utils.pathMatch(url, '/:chapterSlug')
	},

	async getSeriesId(url) {
		const html: any = await get(url);
		const dom = cheerio.load(html.body);

		const chapterId = dom("link[rel='shortlink']").first();
		const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '');
		const chapterIdParse = queryString.parse(chapterIdPre);
		const chapterIdPage = chapterIdParse.p || 0;

		return chapterIdPage;
	},

	async getChapter(url) {
		const html: any = await get(url);
		const dom = cheerio.load(html.body);

		const $readerArea = dom('#readerarea').first();
		const $imageDom = $readerArea.find('img[loading]');

		const $imageList = $imageDom.get().map(el => {
			const $row = dom(el);
			const href = $row.attr().src || false;

			if (href) return encodeURI(href);
			return '';
		});
		// console.log('Item imageList', $imageList)

		const chapterId = dom("link[rel='shortlink']").first();
		const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '');
		const chapterIdParse = queryString.parse(chapterIdPre);
		const chapterIdPage = chapterIdParse.p || 0;

		const pages = $imageList
			.filter(x => validator.isURL(x))
			.map(url => {
				// console.log('pages', url)
				const id = url.split('/').pop().split('#')[0].split('?')[0];
				return { id, url };
			});

		const seriesId = dom('.allc').first()
		const seriesAHref = seriesId.find('a').attr('href')
		const getSeriesId = await this.getSeriesId(seriesAHref)
		// const getSeriesId = -1;

		return {
			id: utils.generateId(this.id, getSeriesId, chapterIdPage),
			url: url,
			pages: pages,
		};
	},

	supportData() {
		return {
			website: this.name,
			siteId: this.id,
			mangaId: true,
			chapterId: true,
			images: true
		}
	},
};

export default KomikindoAdapter;
