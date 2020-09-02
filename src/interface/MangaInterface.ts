export interface mangaServicesResponsePages {
	_id?: string;
	id: string;
	url: string;
}

export interface mangaServicesResponse {
	id: string;
	url: string;
	pages: Array<mangaServicesResponsePages>;

	title?: string;
}

export interface mangaResponse {
	error: boolean;
	message: string;

	data?: any;
}

export interface mangaQueryParams {
	url?: string;
	proxy?: string;
}

export interface AdapterInterface {
	id: string
	name: string
	supportsUrl: Function
	supportsReading: Function
	_getHost: Function
	patternChapter: Function
	getChapter: Function
	supportData: Function

	getSeriesId?: Function | number | string
	puppeteerRun?: Function
}
