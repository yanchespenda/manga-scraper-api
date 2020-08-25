import puppeteer from 'puppeteer';
import validator from 'validator';
import utils from '../utils';

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
		await browser.close();

		return $imageList;
	},

	async getChapter(url: any) {
		const $imageList = await this.puppeteerRun(url);

		const chapterIdPage = -1;

		const pages = $imageList
			.filter(x => validator.isURL(x))
			.map((url: any) => {
				const id = url.split('/').pop().split('#')[0].split('?')[0];
				return { id, url };
			});

		const getSeriesId = -1;

		return {
			id: utils.generateId(this.id, getSeriesId, chapterIdPage),
			url: url,
			pages: pages,
		};
	},
};

export default KomikgueAdapter;
