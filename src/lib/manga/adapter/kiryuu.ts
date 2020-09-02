import cheerio from 'cheerio';
import validator from 'validator';
import queryString from 'query-string';
import { get } from '../get';
import utils from '../utils';
import { mangaServicesResponse } from '../../../interface/MangaInterface';

const KiryuuAdapter = {
	id: 'kiryuu',
	name: 'Kiryuu',

	supportsUrl(url) {
		return /^https?:\/\/(www\.)?kiryuu.co/.test(url);
	},

	supportsReading() {
		return true;
	},

	_getHost() {
		return `https://kiryuu.co/`;
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

	async getChapter(url): Promise<mangaServicesResponse> {
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

		const getTitle = dom('title').first().text().trim()
		

		return {
			id: utils.generateId(this.id, getSeriesId, chapterIdPage),
			url: url,
			pages: pages,

			title: getTitle
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

export default KiryuuAdapter;
