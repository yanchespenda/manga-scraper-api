import * as MangaController from '../controllers/MangaController';
import * as BaseController from '../controllers/BaseController'
import * as FrontendController from '../controllers/FrontendController'
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

const getIndex: RouteOptions = {
	method: 'GET',
	url: '/',
	handler: BaseController.getIndex,
};

/* Frontend Routes */
const getFESupport: RouteOptions = {
	method: 'GET',
	url: '/api/_next/support',
	handler: FrontendController.getIndexSupportSite,
};

/* const createMangaRoute: RouteOptions = {
	method: 'POST',
	url: '/api/manga',
	handler: MangaController.createManga,
}; */

const routes = [
	getIndex,

	getFESupport,
	
	getMangaRoute,
	getDownloadRoute,
	getProxyRoute
];

export default routes;
