const cheerio = require('cheerio')
const validator = require('validator')
const get = require('../get')
const queryString = require('query-string')
const utils = require('../utils')


const MaidAdapter = {
    id: 'maid',
    name: 'Maid',

    supportsUrl(url) {
        return /^https?:\/\/(www\.)?maid.my.id/.test(url);
    },

    supportsReading() {
        return true;
    },

    _getHost() {
        return `https://www.maid.my.id`;
    },

    async getSeriesId(url) {
        const html = await get(url)
        const dom = cheerio.load(html.body)

        const chapterId = dom('link[rel=\'shortlink\']').first()
        const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '')
        const chapterIdParse = queryString.parse(chapterIdPre)
        const chapterIdPage = chapterIdParse.p || 0

        return chapterIdPage
    },

    async getSeries(url) {

    },

    async getChapter(url) {
        const html = await get(url)
        const dom = cheerio.load(html.body)

        const $readerArea = dom('.reader-area').first()
        const $imageDom = $readerArea.find('img')

        const $imageList = $imageDom.get().map(el => {
            const $row = dom(el)
            const href = $row.attr('src')

            if (href)
                return href
            return ""
        })

        const chapterId = dom('link[rel=\'shortlink\']').first()
        const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '')
        const chapterIdParse = queryString.parse(chapterIdPre)
        const chapterIdPage = chapterIdParse.p || 0

        const pages = $imageList.filter(x => validator.isURL(x)).map((url, i) => {
            const id = url.split('/').pop().split('#')[0].split('?')[0]
            return { id, url }
        });

        const seriesId = dom('.coverz').first()
        const seriesAHref = seriesId.find('a').attr('href')
        const getSeriesId = await this.getSeriesId(seriesAHref)

        return {
            id: utils.generateId(this.id, getSeriesId, chapterIdPage),
            url: url,
            pages: pages
        }
    }
}

module.exports = MaidAdapter
