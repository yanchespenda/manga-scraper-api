const supports = require('./supports')
const utils = require('./utils')

const komikcastAdapter = require('./adapter/komikcast')
const MaidAdapter = require('./adapter/maid')
const KomikuAdapter = require('./adapter/komiku')
const KomikgueAdapter = require('./adapter/komikgue')
const KiryuuAdapter = require('./adapter/kiryuu')
const MangakuAdapter = require('./adapter/mangaku')

const manga = {
    support: (url) => {
        if (!supports(url)) {
            return false
        }
        return true
    },

    get: async url => {
        let getChapter = {
            id: null,
            url: null,
            pages: []
        }
        if (komikcastAdapter.supportsUrl(url)) {
            console.log("mangaFound: " + komikcastAdapter.name)

            const matches = utils.pathMatch(
                url,
                '/chapter/:chapterSlug',
            )

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: `INVALID_URL`,
                }
            }

            getChapter = await komikcastAdapter.getChapter(url)
        } else
        if (MaidAdapter.supportsUrl(url)) {
            console.log("mangaFound: " + MaidAdapter.name)

            const matches = utils.pathMatch(
                url,
                '/:chapterSlug',
            )

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: `INVALID_URL`,
                }
            }

            getChapter = await MaidAdapter.getChapter(url)
        } else
        if (KomikuAdapter.supportsUrl(url)) {
            console.log("mangaFound: " + KomikuAdapter.name)

            const matches = utils.pathMatch(
                url,
                '/:chapterSlug',
            )

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: `INVALID_URL`,
                }
            }

            getChapter = await KomikuAdapter.getChapter(url)
        } else
        if (KomikgueAdapter.supportsUrl(url)) {
            console.log("mangaFound: " + KomikgueAdapter.name)

            const matches = utils.pathMatch(
                url,
                '/manga/:seriesSlug/:chapterSlug/:page?',
            )

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: `INVALID_URL`,
                }
            }

            getChapter = await KomikgueAdapter.getChapter(url)
        } else
        if (KiryuuAdapter.supportsUrl(url)) {
            console.log("mangaFound: " + KiryuuAdapter.name)

            const matches = utils.pathMatch(
                url,
                '/:chapterSlug',
            )

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: `INVALID_URL`,
                }
            }

            try {
                getChapter = await KiryuuAdapter.getChapter(url)
            } catch (error) {
                console.error('error', error)
                return reply.code(403).send({
                    error: true,
                    message: error
                })
            }
        } else
        if (MangakuAdapter.supportsUrl(url)) {
            console.log("mangaFound: " + MangakuAdapter.name)

            const matches = utils.pathMatch(
                url,
                '/:chapterSlug',
            )

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: `INVALID_URL`,
                }
            }

            try {
                getChapter = await MangakuAdapter.getChapter(url)
            } catch (error) {
                console.error('error', error)
                return reply.code(403).send({
                    error: true,
                    message: error
                })
            }
        }

        return getChapter
    }
}

module.exports = manga
