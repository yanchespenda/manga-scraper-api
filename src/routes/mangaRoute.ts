import * as MangaController from '../controllers/MangaController';
import { RouteOptions } from 'fastify';

const getMangaRoute: RouteOptions = {
	method: 'GET',
	url: '/api/manga',
	handler: MangaController.getManga,
};

const getDownloadRoute: RouteOptions = {
	method: 'GET',
	url: '/api/download',
	handler: MangaController.getDownload,
};

const getProxyRoute: RouteOptions = {
	method: 'GET',
	url: '/api/proxy',
	handler: MangaController.getProxy,
};

/* const createMangaRoute: RouteOptions = {
	method: 'POST',
	url: '/api/manga',
	handler: MangaController.createManga,
}; */

const routes = [getMangaRoute, getDownloadRoute, getProxyRoute];

export default routes;
