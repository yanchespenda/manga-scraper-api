const poketo = require('poketo')
const fs = require('fs')
const PORT = process.env.PORT || 3000
const request = require('request')
const queryString = require('query-string')
const path = require('path')
const validator = require('validator')
const manga = require('./manga')
const moment = require('moment')
const pdfmake = require('./plugin/js/index')

// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
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

const download = async (url, path) => {
    request.head(url, async (err, res, body) => {
        await new Promise((resolve, reject) => {
            request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', resolve)
            .on('error', console.error)
        })
      
    })
  }

/* const createDir = async (dir) => {
    await !fs.existsSync(dir) && await fs.mkdirSync(dir)
} */

/* const createDir = (path) => {
    // check if dir exist
    fs.stat(path, (err, stats) => {
        if (stats.isDirectory()) {
            // do nothing
        } else {
            // if the given path is not a directory, create a directory
            fs.mkdirSync(path)
        }
    })
} */

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

        /* return reply.code(200).send({
            error: false,
            message: "OK",
            data: getImages
        }) */
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

        return reply.code(200).send({
            error: false,
            message: "OK",
            data: getImages
        })
    }

    // console.log(getImages)

    const getCurrentTimestamp = moment().format('x')
    const getChapter = getImages.pages || []
    const getSiteId = getImages.id.split(':')[0]
    let pdfImage = []
    if (getChapter.length > 0) {
        let idx = 0
        for (const page of getChapter) {
            let fileNumber = idx
            if (idx < 10) {
                fileNumber = '00' + idx
            } else if (idx < 100) {
                fileNumber = '0' + idx
            }
            const getExt = path.extname(page.id) || '.jpg'
            const filename = fileNumber + getExt
            const getDir = path.join(__dirname, 'temp', getSiteId, getCurrentTimestamp)
            const getFullpath = path.join(getDir, filename)

            await fs.promises.mkdir(getDir, { recursive: true })

            await download(page.url, getFullpath)

            pdfImage.push({
                image: getFullpath
            })
            idx++
        }

        const docDefinition = {
            content: pdfImage 
        }
    
        var pdf = pdfmake.createPdf(docDefinition);
        pdf.write('temp/images.pdf').then(() => {
            console.log(new Date() - now);
        }, err => {
            console.error(err);
        })
    }

    // pdfDoc = pdfmake.createPdfKitDocument(pdf)
    // pdfDoc.pipe(fs.createWriteStream('temp/images.pdf'))
    // pdfDoc.end()

    return {
        error: false,
        message: 'OK',
        data: {
            // list: getImages
            // a: getChapter,
            // urlData: urlData,
            // getInfo: getInfo
        }
    }
})

/* Google Drive Streaming */
fastify.get('/drive', async (request, reply) => {

})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(PORT, '0.0.0.0')
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()