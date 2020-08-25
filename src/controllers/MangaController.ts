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

	const url: string = encodeURI(query.url);
	let isMangaFound = false;
	let isMangaUpdate = false;
	let MangaSchemaId: any = 0;
	try {
		const mangaSchema = await MangaSchema.findOne({
			chapterUrl: url,
		});
		if (mangaSchema) {
			const getCreatedAtMoment = moment(mangaSchema.updatedAt).add(config.manga.reScrapAfter, 'minutes');
			if (getCreatedAtMoment > moment()) {
				isMangaFound = true;

				MangaSchemaId = mangaSchema._id;

				const dataReturn: mangaServicesResponse = {
					id: mangaSchema.fullMangaId,
					url: decodeURI(mangaSchema.chapterUrl),
					pages: mangaSchema.imageList.map(val => {
						return { id: val.id, url: val.url };
					}),
				};

				return dataReturn;
			} else {
				isMangaUpdate = true;
			}
		}
	} catch (error) {}

	const mangaService = new MangaService();

	const responseManga: mangaServicesResponse = await mangaService.runScraping(reply, url);

	if (!isMangaFound) {
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
					await MangaSchema.create({
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
				} catch (error) {}
			}
		}
	}

	return reply.send({
		error: false,
		message: 'Success',
		data: responseManga,
	});
};

export const createManga = async (request: FastifyRequest, reply: FastifyReply) => {
	const requestQuery = request.query;
	const requestBody = request.body;

	return reply.send({
		query: requestQuery,
		body: requestBody,
	});
};
