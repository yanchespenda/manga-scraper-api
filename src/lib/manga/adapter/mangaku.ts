import puppeteer from 'puppeteer';
import validator from 'validator';
import utils from '../utils';
import cheerio from 'cheerio';
import { mangaServicesResponse } from '../../../interface/MangaInterface';

const KomikgueAdapter = {
	id: 'mangaku',
	name: 'Mangaku',

	supportsUrl(url) {
		return /^https?:\/\/(www\.)?mangaku.pro/.test(url);
	},

	supportsReading() {
		return true;
	},

	_getHost() {
		return `https://mangaku.pro`;
	},

	patternChapter(url) {
		return utils.pathMatch(url, '/:chapterSlug')
	},

	async puppeteerRun(url: any) {
		const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
		const page = await browser.newPage();

		const $imageList: any = [];
		page.on('response', async response => {
			const status: number = response.status();
			const url: any = response.url();
			if (status === 200 || status === 304) {
				if (response.request().resourceType() === 'image') {
					response.buffer().then(() => {
						const isCDNImage = /^https?:\/\/(www\.)?(cdn|cdn2).mangaku.link/.test(url);
						if (isCDNImage) {
							const isJPGImage = url.split('.').pop();
							if (isJPGImage === 'jpg' || isJPGImage === 'png') {
								const encodeURL = encodeURI(url);
								$imageList.push(encodeURL);
							}
						}
					});
				}
			}
		});

		await page.goto(url, { waitUntil: 'networkidle0' });

		const dom = cheerio.load(await page.content());
		const getTitle = dom('title').first().text().trim()
		const data = {
			getTitle
		};

		await browser.close();

		return {
			image: $imageList,
			data: data
		};
	},

	async getChapter(url): Promise<mangaServicesResponse> {
		const getData = await this.puppeteerRun(url);

		const $imageList = getData.image

		const chapterIdPage = -1;

		const pages = $imageList
			.filter(x => validator.isURL(x))
			.map((url: any) => {
				const id = url.split('/').pop().split('#')[0].split('?')[0];
				return { id, url };
			});

		const getSeriesId = -1;

		const getTitle = getData.data.getTitle
		

		return {
			id: utils.generateId(this.id, getSeriesId, chapterIdPage),
			url: url,
			pages: pages,

			title: getTitle
		};
	},

	supportData() {
		return {
			website: this.name,
			siteId: this.id,
			mangaId: false,
			chapterId: false,
			images: true
		}
	},
};

export default KomikgueAdapter;
