const cheerio = require('cheerio')
const validator = require('validator')
const get = require('../get')
const queryString = require('query-string')
const utils = require('../utils')


const KomikgueAdapter = {
    id: 'komikgue',
    name: 'Komik Gue',

    supportsUrl(url) {
        return /^http?:\/\/(www\.)?mangaku.pro/.test(url);
    },

    supportsReading() {
        return true;
    },

    _getHost() {
        return `http://mangaku.pro`;
    },

    /* async getSeriesId(url) {
        const html = await get(url)
        const dom = cheerio.load(html.body)

        const chapterId = dom('link[rel=\'shortlink\']').first()
        const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '')
        const chapterIdParse = queryString.parse(chapterIdPre)
        const chapterIdPage = chapterIdParse.p || 0

        return chapterIdPage
    }, */

    /* async getSeries(url) {

    }, */

    async getChapter(url) {
        const html = await get(url)
        const dom = cheerio.load(html.body)

        const $readerArea = dom('#all').first()
        const $imageDom = $readerArea.find('img')

        const $imageList = $imageDom.get().map(el => {
            const $row = dom(el)
            const href = $row.attr('src')

            if (href)
                return href
            return ""
        })

        /* const chapterId = dom('link[rel=\'shortlink\']').first()
        const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '')
        const chapterIdParse = queryString.parse(chapterIdPre)
        const chapterIdPage = chapterIdParse.p || 0 */
        const chapterIdPage = -1

        const pages = $imageList.filter(x => validator.isURL(x)).map((url, i) => {
            const id = url.split('/').pop().split('#')[0].split('?')[0]
            return { id, url }
        });

        /* const seriesId = dom('.allc').first()
        const seriesAHref = seriesId.find('a').attr('href')
        const getSeriesId = await this.getSeriesId(seriesAHref) */
        const getSeriesId = -1

        return {
            id: utils.generateId(this.id, getSeriesId, chapterIdPage),
            url: url,
            pages: pages
        }
    }
}

module.exports = KomikgueAdapter
