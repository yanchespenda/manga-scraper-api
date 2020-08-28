const env: any = process.env;
const PORT: any = process.env.PORT || 3000;

let mongoURI = 'mongodb://localhost:27017/project-manga-scraping';
if (env.MONGO_URI !== undefined) {
	mongoURI = env.MONGO_URI;
}

export const config = {
	app: {
		port: PORT,
	},
	manga: {
		reScrapAfter: 3600 * 24, // 1 day
	},
	db: {
		mongoURI: mongoURI,
	},

	pdf: {
		url: 900
	}
};
