export interface mangaServicesResponsePages {
	_id?: string;
	id: string;
	url: string;
}

export interface mangaServicesResponse {
	id: string;
	url: string;
	pages: Array<mangaServicesResponsePages>;
}

export interface mangaResponse {
	error: boolean;
	message: string;

	data?: any;
}
