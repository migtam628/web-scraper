const functions = require("firebase-functions");
const express = require("express");
const app = express()

const browserObject = require('./scraper/browser');
const scraperController = require('./scraper/pageController');

let browserInstance = browserObject.startBrowser();

app.get('/scrape', (req, res) => {
    functions.logger.info("Scraper started.", { structuredData: true });
    scraperController(browserInstance, req, res)
})

exports.web_scraper = functions.https.onRequest(app);
