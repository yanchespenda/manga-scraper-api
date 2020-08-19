const cheerio = require('cheerio')
const validator = require('validator')
const get = require('../get')
const queryString = require('query-string')
const utils = require('../utils')


const KomikcastAdapter = {
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

        const $readerArea = dom('#readerarea').first()
        let $imageDom = $readerArea.find('img[loading]')

        const $imageList = $imageDom.get().map(el => {
            const $row = dom(el)
            const href = $row.attr().src || false

            if (href)
                return encodeURI(href)
            return ""
        })
        // console.log('Item imageList', $imageList)

        const chapterId = dom('link[rel=\'shortlink\']').first()
        const chapterIdPre = chapterId.attr('href').replace(this._getHost(), '').replace('/?', '')
        const chapterIdParse = queryString.parse(chapterIdPre)
        const chapterIdPage = chapterIdParse.p || 0

        const pages = $imageList.filter(x => validator.isURL(x)).map(url => {
            // console.log('pages', url)
            const id = url.split('/').pop().split('#')[0].split('?')[0]
            return { id, url }
        })

        const seriesId = dom('.allc').first()
        const seriesAHref = seriesId.find('a').attr('href')
        // const getSeriesId = await this.getSeriesId(seriesAHref)
        const getSeriesId = -1

        return {
            id: utils.generateId(this.id, getSeriesId, chapterIdPage),
            url: url,
            pages: pages
        }
    }
}

module.exports = KomikcastAdapter
