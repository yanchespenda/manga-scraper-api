const supportedDomains = [
	'komikcast.com',
	'maid.my.id',
	'komiku.co.id',
	'komikgue.com',
	'kiryuu.co',
	'mangaku.pro',
	'mangashiro.co',
	'mangadop.info',
	'komikindo.web.id',
	'mangaindo.web.id',
];

export default url => supportedDomains.some(str => url.indexOf(str) !== -1);
