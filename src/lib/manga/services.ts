import supports from './supports';
import utils from './utils';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import poketo from 'poketo';
import boom from '@hapi/boom';
import {
    FastifyReply
} from 'fastify';
import sharp from "sharp";
import {
    mangaServicesResponse
} from '../../interface/MangaInterface';
import moment from 'moment';
import { AmazonWebServicesS3Storage } from "../../patch/S3Adapter";
import { StorageManager } from "@slynova/flydrive";
import { PDFDocument } from "pdf-lib";

import komikcastAdapter from './adapter/komikcast';
import MaidAdapter from './adapter/maid';
import KomikuAdapter from './adapter/komiku';
import KomikgueAdapter from './adapter/komikgue';
import KiryuuAdapter from './adapter/kiryuu';
import MangakuAdapter from './adapter/mangaku';
import MangashiroAdapter from './adapter/mangashiro';
import MangadopAdapter from './adapter/mangadop';
import KomikindoAdapter from './adapter/komikindo';
import MangaindoAdapter from './adapter/mangaindo';
import MangakyoAdapter from './adapter/mangakyo';

import { config } from "../../config";

const storage = new StorageManager({
    default: 'wasabi',
    disks: {
        wasabi: {
            driver: 's3',
            config: {
                key: config.s3.key,
                endpoint: config.s3.endpoint,
                secret: config.s3.secret,
                bucket: config.s3.bucket,
                region: config.s3.region,
            }
        }
    }
})
const S3Adapter: any = AmazonWebServicesS3Storage
storage.registerDriver('s3', S3Adapter)


export class MangaService {
    // constructor() { }

    support(url) {
        if (!supports(url)) {
            return false;
        }
        return true;
    }

    async get(url) {
        let getChapter: any = {
            id: null,
            url: null,
            pages: [],
        };
        if (komikcastAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + komikcastAdapter.name);

            const matches = utils.pathMatch(url, '/chapter/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await komikcastAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (MaidAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + MaidAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await MaidAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (KomikuAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + KomikuAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await KomikuAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (KomikgueAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + KomikgueAdapter.name);

            const matches = utils.pathMatch(url, '/manga/:seriesSlug/:chapterSlug/:page?');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await KomikgueAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (KiryuuAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + KiryuuAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await KiryuuAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (MangakuAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + MangakuAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await MangakuAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (MangashiroAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + MangashiroAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await MangashiroAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (MangadopAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + MangadopAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await MangadopAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (KomikindoAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + KomikindoAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await KomikindoAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (MangaindoAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + MangaindoAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await MangaindoAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        } else if (MangakyoAdapter.supportsUrl(url)) {
            console.log('mangaFound: ' + MangakyoAdapter.name);

            const matches = utils.pathMatch(url, '/:chapterSlug');

            if (!matches) {
                throw {
                    name: `Unable to parse '${url}'`,
                    code: 'INVALID_URL',
                };
            }

            try {
                getChapter = await MangakyoAdapter.getChapter(url);
            } catch (error) {
                console.error('error', error);
            }
        }

        //MangakyoAdapter
        return getChapter;
    }

    parserId(mangaId) {
        return utils.parseId(mangaId);
    }

    deleteFolderRecursive(pathDir) {
        if (fs.existsSync(pathDir)) {
            const getFiles = fs.readdirSync(pathDir)
            if (getFiles && getFiles.length > 0) {
                for (const file of getFiles) {
                    const curPath = path.join(pathDir, file);
                    if (fs.lstatSync(curPath).isDirectory()) {
                        this.deleteFolderRecursive(curPath);
                    } else {
                        fs.unlinkSync(curPath);
                    }
                }
            }
        }
    }

    deleteExpiredFiles(pathDir) {
        fs.readdir(pathDir, (err, files) => {
            if (err) console.log(err)
            
            if (files && files.length > 0) {
                for (const file of files) {
                    fs.stat(path.join(pathDir, file), function (err, stat) {
                        var endTime, now;
                        if (err) {
                            return console.error(err);
                        }
                        now = new Date().getTime();
                        endTime = new Date(stat.ctime).getTime() + 3600000;
                        if (now > endTime) {
                            return fs.unlinkSync(path.join(pathDir, file));
                        }
                    });
                }
            }
        });
    }

    async downloadFile(fileUrl, outputLocationPath) {
        const writer = fs.createWriteStream(outputLocationPath);

        return axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
        }).then(response => {
            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                let error: any = null;
                writer.on('error', err => {
                    error = err;
                    writer.close();
                    reject(err);
                });
                writer.on('close', () => {
                    if (!error) {
                        resolve(true);
                    }
                });
            });
        });
    }

    async beginDownload(pages, dir) {
        await fs.promises.mkdir(dir, {
            recursive: true,
        });

        return await Promise.all(
            pages.map(async (page, idx) => {
                let fileNumber = idx;
                if (idx < 10) {
                    fileNumber = '00' + idx;
                } else if (idx < 100) {
                    fileNumber = '0' + idx;
                }
                const getExt = path.extname(page.id) || '.jpg';
                const filename = fileNumber + getExt;
                const getFullpath = path.join(dir, filename);

                await this.downloadFile(page.url, getFullpath);

                return await sharp(getFullpath).jpeg().toBuffer();
            }),
        );
    }

    async generatePDF(id: string, imageList: any, dbId: string) {
        const rootDir = path.join(process.cwd())
        const tempDir = path.join(rootDir, 'temp')
        try {
            this.deleteExpiredFiles(tempDir)
        } catch (error) {
            console.log('Failed to deleteExpiredFiles', error)
        }

        const getCurrentTimestamp = moment().format('x')
        const getDir = path.join(tempDir, id, getCurrentTimestamp)
        const pdfImage: any = await this.beginDownload(imageList, getDir)
        const pdfDoc = await PDFDocument.create()
        
        for (const item of pdfImage) {
            const img = await pdfDoc.embedJpg(item)
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
        const wasabiFilename = 'manga-pdf-generator/' + id + '-' + dbId + '.pdf'

        await storage.disk('wasabi').put(wasabiFilename, pdfBuffer)

        this.deleteFolderRecursive(getDir)

        return wasabiFilename
    }

    async generatePDFDownloadLink(pdfLink: string) {
        const uri = await storage.disk('wasabi').getSignedUrl(pdfLink, { expiry: 60 * 10 })

        if (uri) {
            return uri.signedUrl
        }
        return ""
    }

    async runScraping(reply: FastifyReply, url: string): Promise<mangaServicesResponse> {
        let responseManga: mangaServicesResponse = {
            id: '',
            url: '',
            pages: [],
        };
        let poketoNotSupport = false;

        try {
            responseManga = await poketo.getChapter(url);
        } catch (error) {
            if (error.code === 'UNSUPPORTED_SITE') {
                poketoNotSupport = true;
            } else {
                throw boom.boomify(error);
                /* return reply.code(403).send({
                	error: true,
                	message: error
                }) */
            }
        }

        if (poketoNotSupport) {
            if (!this.support(url)) {
                return reply.code(403).send({
                    error: true,
                    message: 'Website not support',
                });
            }

            try {
                responseManga = await this.get(url);
            } catch (error) {
                throw boom.boomify(error);
                /* return reply.code(403).send({
                	error: true,
                	message: error
                }) */
            }
        }

        return responseManga;
    }
}
