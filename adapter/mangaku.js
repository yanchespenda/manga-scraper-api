// const cheerio = require('cheerio')
const validator = require('validator')
// const get = require('../get')
// const queryString = require('query-string')
const utils = require('../utils')
const puppeteer = require('puppeteer')


const KomikgueAdapter = {
    id: 'mangaku',
    name: 'Mangaku',

    supportsUrl(url) {
        return /^https?:\/\/(www\.)?mangaku.pro/.test(url);
    },

    supportsReading() {
        return true;
    },

    _getHost() {
        return `https://mangaku.pro`;
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

    async puppeteerRun(url) {
        console.log('puppeter Run')
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()

        let $imageList = []
        page.on('response', async response => {
            const status = response.status()
            const url = response.url()
            if ((status >= 300) && (status <= 399)) {
                // console.log('Redirect from', url, 'to', response.headers()['location'])
            }
            if (status === 200 || status === 304) {
                if (response.request().resourceType() === 'image') {
                    response.buffer().then(file => {
                       const isCDNImage = /^https?:\/\/(www\.)?cdn.mangaku.link/.test(url)
                       if (isCDNImage) {
                            const isJPGImage = url.split('.').pop()
                            if (isJPGImage === 'jpg' || isJPGImage === 'png') {
                                // console.log('Image url', url)
                                $imageList.push(encodeURI(url))
                            }
                       }
                           
                    })
                }
            }
            
        })

        await page.goto(url, { waitUntil: 'networkidle0' })
        await browser.close()

        return $imageList
    },

    async getChapter(url) {
        const $imageList = await this.puppeteerRun(url)

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
