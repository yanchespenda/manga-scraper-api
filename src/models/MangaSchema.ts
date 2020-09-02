import mongoose, { Document, Schema } from 'mongoose';

import { mangaServicesResponsePages } from '../interface/MangaInterface';

export interface IManga extends Document {
	webId: string;
	mangaId: string;
	chapterId: string;
	chapterUrl: string;
	fullMangaId: string;

	imageList: Array<mangaServicesResponsePages>;
	pdfLink: string;
	title: string;

	createdAt: string | number | Date;
	updatedAt: string | number | Date;
}

const mangaSchema = new Schema({
	webId: String,
	mangaId: Number,
	chapterId: Number,
	chapterUrl: {
		type: String,
		index: true,
	},
	fullMangaId: {
		type: String,
	},

	imageList: [
		{
			id: String,
			url: String,
		},
	],

	pdfLink: String,
	title: String,

	createdAt: Date,
	updatedAt: Date,
});

export default mongoose.model<IManga>('Manga', mangaSchema);
