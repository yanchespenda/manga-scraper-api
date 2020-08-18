# Manga Scraper API
Scraping image files from manga website, Based on Poketo style

## Supported Sites
### Global
* [Helvetica Scans](http://helveticascans.com)
* [Hot Chocolate Scans](http://hotchocolatescans.com)
* [Jaimini’s Box](https://jaiminisbox.com)
* [Kirei Cake](https://kireicake.com)
* [MangaHere](http://www.mangahere.cc)
* [Mangadex](https://mangadex.org)
* [MangaFox](https://fanfox.net)
* [Mangakakalot](http://mangakakalot.com)
* [Manganelo](http://manganelo.com)
* [MangaStream](https://readms.net)
* [Meraki Scans](http://merakiscans.com)
* [Phoenix Serenade](https://serenade.moe)
* [Sense Scans](https://sensescans.com)
* [Sen Manga](https://raw.senmanga.com)
* [Silent Sky Scans](http://www.silentsky-scans.net)
* [Tuki Scans](https://tukimoop.pw)

### Indonesia
* [Komikcast](https://komikcast.com/)
* [Komikgue](http://www.komikgue.com/)
* [Komiku](https://komiku.co.id/)
* [Maid](https://www.maid.my.id/)
* [Kiryuu](https://kiryuu.co/)


## API Endpoint
```
https://manga-scraper-api.herokuapp.com/
```

| Parameters | Type   | Description   |
|------------|--------|---------------|
| url        | string | Full url site |

### Response API
```
{
    error: (true|false),
    message: (string),
    data: {
        id: (string)[siteId + mangaId + chapterId],
        url: (string),
        pages: [
            {
                id: (string),
                url: (string)
            }
            ...
        ]
    }
}
```
 