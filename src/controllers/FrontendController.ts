import { FastifyRequest, FastifyReply } from "fastify";
import { MangaService } from "../lib/manga/services";
import validator from "validator";
import MangaSchema from "../models/MangaSchema";
import moment from "moment";
import { config } from '../config';
import { mangaServicesResponse, mangaServicesResponsePages } from "../interface/MangaInterface";

export const getIndexSupportSite = async (_request: FastifyRequest, reply: FastifyReply) => {

    const mangaService = new MangaService();

    return reply.send(mangaService.supportSite())
}

export const postStart = async (_request: FastifyRequest, _reply: FastifyReply) => {
    const query: any = _request.body;

    if (!query.url) {
		return _reply.code(400).send({
			error: true,
			message: 'Body url is missing',
		});
    }

    if (!validator.isURL(query.url)) {
		return _reply.code(400).send({
			error: true,
			message: 'URL not valid',
		});
	}

    const url: string = encodeURI(query.url);
    let isMangaFound = false;
	let isMangaUpdate = false;
    let MangaSchemaId: any = '';
	let PDFLink = ''
	let MangaTitle = ''
    try {
		const mangaSchema = await MangaSchema.findOne({
			chapterUrl: url,
		});
		if (mangaSchema) {
			const getCreatedAtMoment = moment(mangaSchema.updatedAt).add(config.manga.reScrapAfter, 'seconds');
			if (getCreatedAtMoment > moment()) {
				isMangaFound = true;
			} else {
				isMangaUpdate = true;
            }
            MangaSchemaId = mangaSchema._id;
			PDFLink = mangaSchema.pdfLink
			MangaTitle = mangaSchema.title
		}
    } catch (error) {}

    const mangaService = new MangaService();

    if (!isMangaFound) {
		const responseManga: mangaServicesResponse = await mangaService.runScraping(_reply, url);
		if (responseManga.id.toString().length > 0 && responseManga.url.toString().length > 0 && responseManga.pages.length > 0) {
			const getParseMangaId = mangaService.parserId(responseManga.id);
			if (getParseMangaId.length > 0) {
				if (isMangaUpdate) {
					try {
						const mangaSchema = await MangaSchema.findOne({
							_id: MangaSchemaId,
						});
	
						if (mangaSchema) {
							mangaSchema.imageList = responseManga.pages;
							mangaSchema.updatedAt = moment.now();
							mangaSchema.save();
						}
							
					} catch (error) {}
				} else {
					try {
						const mangaSchema = await MangaSchema.create({
							webId: getParseMangaId[0],
							mangaId: getParseMangaId[1],
							chapterId: getParseMangaId[2],
							fullMangaId: responseManga.id,
							chapterUrl: url,
							imageList: responseManga.pages,
							pdfLink: '',
							title: responseManga.title || '',
	
							createdAt: moment.now(),
							updatedAt: moment.now(),
						});
	
						if (mangaSchema)
							MangaSchemaId = mangaSchema._id
					} catch (error) {}
				}
			}
			MangaTitle = responseManga.title || ''
		} else {
			return _reply.code(500).send({
				error: true,
				message: 'Sorry, something went wrong',
			});
		}
    }

    let returnData = {
        pdfLink: {
            enable: true,
            link: ''
        },
        reader: {
            enable: false,
            link: ''
		},
		
		info: {
			title: MangaTitle
		}
    }

    if (PDFLink.length > 0) {
        returnData.pdfLink.enable = true
        returnData.pdfLink.link = PDFLink
    }

    if (MangaSchemaId.toString().length > 0) {
        returnData.reader.enable = true
        returnData.reader.link = MangaSchemaId
    }
    
    return returnData
}

export const postPDF = async (_request: FastifyRequest, _reply: FastifyReply) => {
    const query: any = _request.body;

    if (!query.id) {
		return _reply.code(400).send({
			error: true,
			message: 'Body id is missing',
		});
    }

    const id: string = query.id;
    let isMangaFound = false;
    let isMangaHasPDF = false;
    let PDFLink = ""
    let imageList: mangaServicesResponse = {
		id: '',
		url: '',
		pages: []
	}

    try {
		const mangaSchema = await MangaSchema.findOne({
			_id: id,
		});

		if (mangaSchema) {
			isMangaFound = true;

			if (mangaSchema.pdfLink.length !== 0) {
				isMangaHasPDF = true;

				PDFLink = mangaSchema.pdfLink
			}

            imageList.id = mangaSchema.fullMangaId
            imageList.url = mangaSchema.chapterUrl
			imageList.pages = mangaSchema.imageList
		}
    } catch (error) { }

    if (!isMangaFound) {
        return _reply.code(404).send({
			error: true,
			message: 'Manga not found',
		});
    }
    
    const mangaService = new MangaService();

    if (isMangaFound) {
		imageList = await mangaService.runScraping(_reply, imageList.url);
		const getParseMangaId = mangaService.parserId(imageList.id);
		if (getParseMangaId.length > 0) {
			try {
                const mangaSchema = await MangaSchema.findOne({
                    _id: id,
                });

                if (mangaSchema) {
                    mangaSchema.imageList = imageList.pages;
                    mangaSchema.updatedAt = moment.now();
                    mangaSchema.save();
                }
            } catch (error) {}
		}
	}

	if (!isMangaHasPDF) {
		const getParseMangaId = mangaService.parserId(imageList.id);
		if (getParseMangaId.length > 0) {
			PDFLink = await mangaService.generatePDF(getParseMangaId[0], imageList.pages, id)

			const mangaSchema = await MangaSchema.findOne({
				_id: id,
			});

			if (mangaSchema) {
				mangaSchema.pdfLink = PDFLink;
				mangaSchema.save();
			}
		}
	}

	if (PDFLink.length > 0) {
		const baseProxy = `//${_request.hostname}/api/pdf?id=`
		PDFLink = baseProxy + id
	} else {
		return _reply.code(405).send({
			error: true,
			message: 'Failed to generated PDF',
			data: null,
		});
	}

	return _reply.send({
		error: false,
		message: 'Success',
		data: PDFLink,
	});

}

export const getImages = async (_request: FastifyRequest, _reply: FastifyReply) => {
	const query: any = _request.query;

    if (!query.id) {
		return _reply.code(400).send({
			error: true,
			message: 'Query id is missing',
		});
    }

    const id: string = query.id;
	let isMangaFound = false;
	// let isHaveImages = false
	let imageList: mangaServicesResponsePages[] = []
	let title = ''
	
	try {
		const mangaSchema = await MangaSchema.findOne({
			_id: id,
		});

		if (mangaSchema) {
			isMangaFound = true;

			if (mangaSchema.imageList.length !== 0) {
				// isHaveImages = true;

				imageList = mangaSchema.imageList
			}

            title = mangaSchema.title
		}
	} catch (error) { }

	if (!isMangaFound) {
		return _reply.code(404).send({
			error: true,
			message: 'Data not found',
		});
	}

	/* if (!isHaveImages) {
		return _reply.code(404).send({
			error: true,
			message: 'Data not found',
		});
	} */
	
	return _reply.code(200).send({
		title: title,

		images: imageList.map(item => {
			const baseProxy = `//${_request.hostname}/api/proxy?`
			return baseProxy + `mangaId=${id}&pageId=${item._id}`
		})
	});
}
