const env: any = process.env

let mongoURI = 'mongodb://localhost:27017/project-manga-scraping'
if (env.MONGO_URI !== undefined) {
	mongoURI = env.MONGO_URI
}

export const config = {
	app: {
		port: 3000,
	},
	manga: {
		reScrapAfter: 3600 * 24 // 1 day
	},
	db: {
		mongoURI: mongoURI
	},
};
