const poketo = require('poketo')
const fs = require('fs')
const PORT = process.env.PORT || 3000
const request = require('request')
const queryString = require('query-string')
const path = require('path')
const validator = require('validator')
const manga = require('./manga')
const moment = require('moment')
const {
    PDFDocument
} = require('pdf-lib')
const {
    AmazonWebServicesS3Storage
} = require('./fixer/S3Adapter')
const {
    StorageManager
} = require('@slynova/flydrive')

const storage = new StorageManager({
    default: 'wasabi',
    disks: {
        wasabi: {
            driver: 's3',
            config: {
                key: process.env.S3_KEY,
                endpoint: process.env.S3_ENDPOINT,
                secret: process.env.S3_SECRET,
                bucket: process.env.S3_BUCKET,
                region: process.env.S3_REGION,
            }
        }
    }
})
storage.registerDriver('s3', AmazonWebServicesS3Storage)

// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true,
    /* https: {
        key: fs.readFileSync(path.join(__dirname, 'ssl', 'local.com.key')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl', 'local.com.cert'))
    } */
})

fastify.register(require('fastify-routes'))
fastify.register(require('fastify-rate-limit'), {
    max: 100,
    timeWindow: '1 minute'
})
fastify.register(require('fastify-formbody'))
fastify.register(require('fastify-etag'))
fastify.register(require('fastify-url-data'))
fastify.register(require('fastify-cors'), {
    // put your options here
})

// fastify.register(
//     require("fastify-mongoose-driver").plugin, {
//           uri: "mongodb://localhost:27017/mangadownloader",

//         settings: {
//             useNewUrlParser: true,
//             config: {
//                 autoIndex: true,
//             },
//             useUnifiedTopology: true,
//             useCreateIndex: true
//         },
//         models: [
//             {
//                 name: "website",
//                 alias: "Website",
//                 schema: {
//                     domain: {
//                         type: String,
//                         required: true
//                     },
//                     isActive: {
//                         type: Boolean,
//                     },
//                     createdAt: {
//                         type: Date
//                     },
//                     updateAt: {
//                         type: Date
//                     }
//                 }
//             },
//             {
//                 name: "manga_link",
//                 alias: "MangaLink",
//                 schema: {
//                     url: {
//                         type: String,
//                         required: true,
//                     },
//                     createdAt: {
//                         type: Date
//                     },
//                     updateAt: {
//                         type: Date
//                     }
//                 }
//             },
//             {
//                 name: "users",
//                 alias: "Users",
//                 schema: {
//                     username: {
//                         type: String,
//                     },
//                     password: {
//                         type: String,
//                         select: false,
//                         required: true,
//                     },
//                     email: {
//                         type: String,
//                         unique: true,
//                         required: true,
//                         validate: {
//                             validator: (v) => {
//                                 // Super simple email regex: https://stackoverflow.com/a/4964763/7028187
//                                 return /^.+@.{2,}\..{2,}$/.test(v);
//                             },
//                             message: (props) => `${props.value} is not a valid email!`,
//                         },
//                     },
//                     createdAt: {
//                         type: Date,
//                     },
//                 },
//                 /* virtualize: (schema) => {
//                     schema.virtual("posts", {
//                         ref: "Post",
//                         localKey: "_id",
//                         foreignKey: "author",
//                     });
//                 }, */
//             },
//         ],
//         useNameAndAlias: true,
//     },
//     (err) => {
//         if (err) throw err
//     }
// )

const downloadFile = require('./download')

const beginDownload = async (pages, dir) => {
    await fs.promises.mkdir(dir, {
        recursive: true
    })

    return await Promise.all(pages.map(async (page, idx) => {
        let fileNumber = idx
        if (idx < 10) {
            fileNumber = '00' + idx
        } else if (idx < 100) {
            fileNumber = '0' + idx
        }
        const getExt = path.extname(page.id) || '.jpg'
        const filename = fileNumber + getExt
        const getFullpath = path.join(dir, filename)

        await downloadFile(page.url, getFullpath)

        return getFullpath
    }))
}

const deleteFolderRecursive = function (pathDir) {
    if (fs.existsSync(pathDir)) {
        fs.readdirSync(pathDir).forEach((file, index) => {
            const curPath = path.join(pathDir, file)
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath)
            } else { // delete file
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(pathDir)
    }
}


// Declare a route
fastify.get('/', async (request, reply) => {
    const urlData = request.urlData()
    const parsed = queryString.parse(urlData.query)
    let getImages = {
        id: null,
        url: null,
        pages: []
    }

    if (!parsed.url) {
        return reply.code(401).send({
            error: true,
            message: "Query url not found"
        })
    }

    const getUrl = parsed.url

    if (!validator.isURL(getUrl)) {
        return reply.code(401).send({
            error: true,
            message: "Url not valid"
        })
    }

    let poketoNotSupport = false
    try {
        getImages = await poketo.getChapter(getUrl)
    } catch (error) {
        if (error.code === "UNSUPPORTED_SITE") {
            poketoNotSupport = true
        } else {
            return reply.code(403).send({
                error: true,
                message: error
            })
        }
    }

    if (poketoNotSupport) {
        if (!manga.support(getUrl)) {
            return reply.code(403).send({
                error: true,
                message: "Website not support"
            })
        }

        try {
            getImages = await manga.get(getUrl)
        } catch (error) {
            return reply.code(403).send({
                error: true,
                message: error
            })
        }
    }

    const getCurrentTimestamp = moment().format('x')
    const getChapter = getImages.pages || []
    const getSiteId = getImages.id.split(':')[0]
    let pdfImage = []
    const getDir = path.join(__dirname, 'temp', getSiteId, getCurrentTimestamp)
    if (getChapter.length > 0) {

        // console.log('run: beginDownload')
        pdfImage = await beginDownload(getChapter, getDir)
        // console.log('check: pdfImage', pdfImage)

        const pdfDoc = await PDFDocument.create()

        for (const item of pdfImage) {
            const img = await pdfDoc.embedJpg(fs.readFileSync(item))
            const imagePage = pdfDoc.insertPage(0);

            imagePage.drawImage(img, {
                x: 0,
                y: 0,
                width: imagePage.getWidth(),
                height: imagePage.getHeight()
            })
        }

        const pdfBytes = await pdfDoc.save()
        const pdfBuffer = Buffer.from(pdfBytes)

        const wasabiFilename = 'manga-pdf-generator/' + getSiteId + '-' + getCurrentTimestamp + '.pdf'

        await storage.disk('wasabi').put(wasabiFilename, pdfBuffer)
        const uri = await storage.disk('wasabi').getSignedUrl(wasabiFilename, { Expiry: 60 * 10, expiry: 60 * 10 })

        deleteFolderRecursive(getDir)

        return {
            error: false,
            message: 'Success',
            data: uri.signedUrl
        }
    }

    return {
        error: true,
        message: 'Do nothing',
        data: null
    }
})

/* Google Drive Streaming */
fastify.get('/drive', async (request, reply) => {

})

// Run the server!
const start = async () => {
    // console.log(storage.disk('wasabi'))
    try {
        
        await fastify.listen(PORT, '0.0.0.0')
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()