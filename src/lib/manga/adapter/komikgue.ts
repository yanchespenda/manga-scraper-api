import cheerio from 'cheerio';
import validator from 'validator';
// import queryString from "query-string"
import { get } from '../get';
import utils from '../utils';

const KomikgueAdapter = {
	id: 'komikgue',
	name: 'Komik Gue',

	supportsUrl(url) {
		return /^http?:\/\/(www\.)?komikgue.com/.test(url);
	},

	supportsReading() {
		return true;
	},

	_getHost() {
		return `http://www.komikgue.com`;
	},

	/* async getSeriesId(url) {
        const html: any = await get(url)
        const dom = cheerio.load(html.body)

        const chapterId = dom('link[rel=\'shortlink\']').first()
        const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '')
        const chapterIdParse = queryString.parse(chapterIdPre)
        const chapterIdPage = chapterIdParse.p || 0

        return chapterIdPage
    }, */

	async getChapter(url) {
		const html: any = await get(url);
		const dom = cheerio.load(html.body);

		const $readerArea = dom('#all').first();
		const $imageDom = $readerArea.find('img');

		const $imageList = $imageDom.get().map(el => {
			const $row = dom(el);
			const href = $row.attr('src');

			if (href) return encodeURI(href);
			return '';
		});

		/* const chapterId = dom('link[rel=\'shortlink\']').first()
        const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '')
        const chapterIdParse = queryString.parse(chapterIdPre)
        const chapterIdPage = chapterIdParse.p || 0 */
		const chapterIdPage = -1;

		const pages = $imageList
			.filter(x => validator.isURL(x))
			.map(url => {
				const id = url.split('/').pop().split('#')[0].split('?')[0];
				return { id, url };
			});

		/* const seriesId = dom('.allc').first()
        const seriesAHref = seriesId.find('a').attr('href')
        const getSeriesId = await this.getSeriesId(seriesAHref) */
		const getSeriesId = -1;

		return {
			id: utils.generateId(this.id, getSeriesId, chapterIdPage),
			url: url,
			pages: pages,
		};
	},
};

export default KomikgueAdapter;
