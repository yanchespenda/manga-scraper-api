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

const getPDFRoute: RouteOptions = {
	method: 'GET',
	url: '/api/pdf',
	handler: MangaController.getPDF,
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

const postFEStart: RouteOptions = {
	method: 'POST',
	url: '/api/_next/start',
	handler: FrontendController.postStart,
};

const postFEPdf: RouteOptions = {
	method: 'POST',
	url: '/api/_next/pdf',
	handler: FrontendController.postPDF,
};

const getFEReader: RouteOptions = {
	method: 'GET',
	url: '/api/_next/reader',
	handler: FrontendController.getImages,
};


/* const createMangaRoute: RouteOptions = {
	method: 'POST',
	url: '/api/manga',
	handler: MangaController.createManga,
}; */

const routes = [
	getIndex,

	getFESupport,
	postFEStart,
	postFEPdf,
	
	getMangaRoute,
	getDownloadRoute,
	getProxyRoute,
	getPDFRoute,
	getFEReader
];

export default routes;
