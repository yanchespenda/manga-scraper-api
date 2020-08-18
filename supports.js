const supportedDomains = [
    'komikcast.com',
    'maid.my.id',
    'komiku.co.id',
    'komikgue.com',
    'kiryuu.co',
]

module.exports = url => supportedDomains.some(str => url.indexOf(str) !== -1)