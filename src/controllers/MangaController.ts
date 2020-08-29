import MangaSchema from '../models/MangaSchema';
import { FastifyRequest, FastifyReply } from 'fastify';
import { MangaService } from '../lib/manga/services';
import moment from 'moment';
import { mangaServicesResponse } from '../interface/MangaInterface';
import { config } from '../config';

export const getManga = async (request: FastifyRequest, reply: FastifyReply) => {
	const query: any = request.query;

	if (!query.url) {
		return reply.code(400).send({
			error: true,
			message: 'Query url is missing',
		});
	}

	let useProxy = false
	if (query.proxy && query.proxy === 'true') {
		useProxy = true
	}

	const url: string = encodeURI(query.url);
	let isMangaFound = false;
	let isMangaUpdate = false;
	let MangaSchemaId: any = 0;
	let responseManga: mangaServicesResponse = {
		id: '',
		url: url,
		pages: []
	}
	try {
		const mangaSchema = await MangaSchema.findOne({
			chapterUrl: url,
		});
		if (mangaSchema) {
			const getCreatedAtMoment = moment(mangaSchema.updatedAt).add(config.manga.reScrapAfter, 'minutes');
			if (getCreatedAtMoment > moment()) {
				isMangaFound = true;

				MangaSchemaId = mangaSchema._id;

				responseManga = {
					id: mangaSchema.fullMangaId,
					url: decodeURI(mangaSchema.chapterUrl),
					pages: !useProxy ? mangaSchema.imageList.map(val => {
						return { id: val.id, url: val.url };
					}) : mangaSchema.imageList,
				};
			} else {
				isMangaUpdate = true;
			}
		}
	} catch (error) {}

	const mangaService = new MangaService();
	
	if (!isMangaFound) {
		responseManga = await mangaService.runScraping(reply, url);
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

						createdAt: moment.now(),
						updatedAt: moment.now(),
					});

					MangaSchemaId = mangaSchema._id
				} catch (error) {}
			}
		}
	}

	if (useProxy) {
		const baseProxy = `//${request.hostname}/api/proxy?`
		responseManga.pages = responseManga.pages.map(item => {
			return {
				id: item.id,
				url: baseProxy + `mangaId=${MangaSchemaId}&pageId=${item._id}`
			}
		})
	}

	return reply.send({
		error: false,
		message: 'Success',
		data: responseManga,
	});
};

export const getDownload = async (request: FastifyRequest, reply: FastifyReply) => {
	const query: any = request.query;

	if (!query.url) {
		return reply.code(400).send({
			error: true,
			message: 'Query url is missing',
		});
	}

	const url: string = encodeURI(query.url);
	let isMangaFound = false;
	let isMangaUpdate = false;
	let isMangaHasPDF = false;
	let MangaSchemaId: any = 0;
	let PDFLink = ""
	let imageList: mangaServicesResponse = {
		id: '',
		url: url,
		pages: []
	}

	try {
		const mangaSchema = await MangaSchema.findOne({
			chapterUrl: url,
		});

		if (mangaSchema) {
			isMangaFound = true;
			MangaSchemaId = mangaSchema._id;
			isMangaUpdate = true;

			if (mangaSchema.pdfLink.length !== 0) {
				isMangaHasPDF = true;

				PDFLink = mangaSchema.pdfLink
			}

			imageList.id = mangaSchema.fullMangaId
			imageList.pages = mangaSchema.imageList
		}
	} catch (error) { }

	const mangaService = new MangaService();

	if (!isMangaFound) {
		imageList = await mangaService.runScraping(reply, url);
		const getParseMangaId = mangaService.parserId(imageList.id);
		if (getParseMangaId.length > 0) {
			if (isMangaUpdate) {
				try {
					const mangaSchema = await MangaSchema.findOne({
						_id: MangaSchemaId,
					});

					if (mangaSchema) {
						mangaSchema.imageList = imageList.pages;
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
						fullMangaId: imageList.id,
						chapterUrl: url,
						imageList: imageList.pages,
						pdfLink: '',

						createdAt: moment.now(),
						updatedAt: moment.now(),
					});

					MangaSchemaId = mangaSchema._id
				} catch (error) {}
			}
		}
	}

	if (!isMangaHasPDF) {
		const getParseMangaId = mangaService.parserId(imageList.id);
		if (getParseMangaId.length > 0) {
			PDFLink = await mangaService.generatePDF(getParseMangaId[0], imageList.pages, MangaSchemaId)

			const mangaSchema = await MangaSchema.findOne({
				_id: MangaSchemaId,
			});

			if (mangaSchema) {
				mangaSchema.pdfLink = PDFLink;
				mangaSchema.save();
			}
		}
	}

	if (PDFLink.length > 0) {
		PDFLink = await mangaService.generatePDFDownloadLink(PDFLink)
	} else {
		return reply.code(405).send({
			error: true,
			message: 'Failed to generated PDF',
			data: null,
		});
	}

	return reply.send({
		error: false,
		message: 'Success',
		data: PDFLink,
	});
}

/* export const createManga = async (request: FastifyRequest, reply: FastifyReply) => {
	const requestQuery = request.query;
	const requestBody = request.body;

	return reply.send({
		query: requestQuery,
		body: requestBody,
	});
}; */
