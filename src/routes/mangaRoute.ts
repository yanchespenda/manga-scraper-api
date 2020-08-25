import * as MangaController from '../controllers/MangaController';
import { RouteOptions } from 'fastify';

const getMangaRoute: RouteOptions = {
	method: 'GET',
	url: '/api/manga',
	handler: MangaController.getManga,
};

const createMangaRoute: RouteOptions = {
	method: 'POST',
	url: '/api/manga',
	handler: MangaController.createManga,
};

const routes = [getMangaRoute, createMangaRoute];

export default routes;
