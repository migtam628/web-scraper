

const getSetUrl = (params) => `https://www.sec.gov/edgar/search/#/dateRange=${params.dateRange}&entityName=${params.entityName}`;

const scraperObject = (req, res) => {
    let entityName = req?.query.entityName || 'bbig'
    let dateRange = req?.query.dateRange || '1y'

    async function scraper(browser) {
        var page = await browser.newPage();
        console.log(`Navigating to ${getSetUrl({
            entityName: entityName,
            dateRange: dateRange,
        })}...`);
        await page.goto(getSetUrl({
            entityName: entityName,
            dateRange: dateRange,
        }));
        await page.waitForSelector("#select-result-columns");
        await page.evaluate(() => {
            let checkboxes = document.querySelectorAll(
                "fieldset > div > input.form-check-input"
            );
            for (let checkbox of checkboxes) {
                if (!checkbox.checked) {
                    checkbox.click();
                }
            }
            setTimeout(() => { }, 1000);
            return;
        });
        await page.waitForSelector("table");

        let Hits = await page.evaluate(async (r) => {
            console.log(r);
            let hits = await document.querySelectorAll("tbody > tr");
            let data = [];

            for (let i = 0; i < hits.length; i++) {
                let row = hits[i].innerText.split("\t");
                let newObject = {
                    Form: row[0],
                    Filed: row[1],
                    Reporting: row[2],
                    Url: row[7] ? `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&filenum=${row[7]}&owner=include&count=100` : '',
                    Entity: row[3]?.split("\n"),
                    CIK: row[4]?.split("\n"),
                    FileNumber: row[7],
                    FilmNumber: row[8],
                };
                data.push(newObject);
            }
            return data;
        });

        let newHitsArray = Hits.splice(4, Hits.length - 4);

        res.status(200).json(newHitsArray);
    }
    return { scraper };
};

// export { scraperObject };
module.exports = scraperObject;
