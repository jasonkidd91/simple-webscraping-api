const cloudscraper = require('cloudscraper');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class baseDataProvider {
    static get url() {
        let url = 'https://www.any-ecommerce-website.com';
        return url;
    }

    static get searchUrl() {
        let url = 'https://www.any-ecommerce-website.com?search_query={keyword}';
        return url;
    }

    static domParser(url) {
        return new Promise((resolve, reject) => {
            // cloudscraper.get(url).then(console.log, console.error);

            // const resourceLoader = new jsdom.ResourceLoader({
            //     // strictSSL: true,
            //     userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
            // });

            // const options = {
            //     resources: resourceLoader,
            //     // runScripts: 'dangerously',
            //     // pretendToBeVisual: true,
            //     // virtualConsole: new jsdom.VirtualConsole(),
            //     // cookieJar: new jsdom.CookieJar()
            // }

            // JSDOM.fromURL(url, options)  //  deprecated as cloudflare blocked
            cloudscraper.get(url).then(dom => {
                var items = [];
                // const document = dom.window.document;
                const document = new jsdom.JSDOM(dom).window.document;
                document.querySelectorAll('.card').forEach(function (el) {
                    const blockContent = el.querySelector('.card-block');
                    const code = blockContent.querySelector('h4.card-title');
                    const title = blockContent.querySelector('h5.card-title');
                    const linkUrl = el.querySelector("a").getAttribute("href");
                    let imageUrl = el.querySelector("a > img").getAttribute("data-src");
                    if (imageUrl.indexOf('http') < 0) imageUrl = `https:${imageUrl}`;
                    let item = {
                        code: code.textContent,
                        codeUrl: baseDataProvider.searchUrl.replace('{keyword}', code.textContent),
                        title: title ? title.textContent : null,
                        linkUrl: linkUrl,
                        imageUrl: imageUrl,
                        tags: null,
                        date: null
                    }

                    //get tag and url
                    const txtContent = blockContent.querySelector('p');
                    if (txtContent.textContent.indexOf('Tag') >= 0) {
                        let tags = [];
                        let tagStr = txtContent.outerHTML.match(new RegExp('Tag\n\t(.*)<br>'));
                        new JSDOM(tagStr).window.document.querySelectorAll('a').forEach(function (el) {
                            let tag = {
                                name: el.textContent,
                                url: el.getAttribute('href')
                            }
                            tags.push(tag);
                        });
                        //remove duplicate
                        tags = tags
                            .map(p => p['tag'])
                            // store the keys of the unique objects
                            .map((e, i, final) => final.indexOf(e) === i && i)
                            // eliminate the dead keys & store unique objects
                            .filter(e => tags[e]).map(e => tags[e]);
                        item.tags = tags;
                    }

                    //get date
                    let dateStr = txtContent.outerHTML.match(new RegExp('\\d{4}-\\d{2}-\\d{2}'));
                    if (dateStr && dateStr.length >= 0) item.date = dateStr[0];
                    items.push(item);
                });
                resolve(items);
            }, err => {
                console.error(err);
                reject(err);
            });
        });
    }
}

module.exports = baseDataProvider;