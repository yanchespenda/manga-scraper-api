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
	let MangaSchemaId: any = 0;
	let imageList = []

	try {
		const mangaSchema = await MangaSchema.findOne({
			chapterUrl: url,
		});

		console.log(mangaSchema)
	} catch (error) {
		
	}

	return reply.send({
		error: false,
		message: 'Success',
		data: {
			isMangaFound,
			isMangaUpdate,
			MangaSchemaId,
			imageList
		},
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
