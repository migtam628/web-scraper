const app = require("express")();
const browserObject = require('./browser');
const scraperController = require('./pageController');
const functions = require("firebase-functions");


//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
scraperController(browserInstance)

app.get('/scrape', (req, res) => {
    functions.logger.info("Scraper started.", { structuredData: true });
    scraperController(browserInstance, req, res)
})

exports.web_scraper = functions.https.onRequest(app);
