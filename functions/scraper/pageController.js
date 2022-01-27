const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance, req, res) {
    let browser;
    try {
        browser = await browserInstance;
        await pageScraper(req, res).scraper(browser);
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance, req, res) => scrapeAll(browserInstance, req, res)
