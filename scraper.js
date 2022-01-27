var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");


var app = express();

app.get("/scrape", function (req, res) {
  let Url = "https://www.sec.gov/edgar/search/#/dateRange=all&category=custom&entityName=apple&cik=0000320193&type=10-k&count=100&action=getcompany";

  // var id = req.query.id;
  // var title = req.query.title;
  // var url = `https://www.imdb.com/title/${id}`;
  // url1 = `https://www.imdb.com/find?ref_=nv_sr_fn&q=${encodeURI(title)}&s=all`;
  request(Url, function (error, response, html) {
    if (!error) {

      const $ = cheerio.load(html);
      
      const resss = $("tr").text();

      res.json(html);
      



      var json = {
        title: "",
        release_date: "",
        rating: "",
        runtime: "",
        keywords: "",
        country: "",
        language: "",
        cast: [],
        plot: "",
        storyline: "",
        filming_locations: "",
        poster: "",
        backdrop: "",
      };

      $(".title_wrapper").filter(function () {
        var data = $(this);
        var title = data.children().first().text().trim();
        var release = data.children().last().children().last().text().trim();
        json.title = title;
        json.release_date = release;
      });

      $(".ratingValue").filter(function () {
        var data = $(this);
        var rating = data.text().trim();
        json.rating = rating;
      });

      $("time").filter(function () {
        var data = $(this);
        var runtime = data.text().trim();
        json.runtime = runtime;
      });

      $(".slate").filter(function () {
        var data = $(this);
        var backdrop = data.children().first().children().first().attr("src");
        json.backdrop = backdrop;
      });

      $(".poster").filter(function () {
        var data = $(this);
        var poster = data.children().first().children().first().attr("src");
        json.poster = poster;
      });

      $(".summary_text").filter(function () {
        var data = $(this);
        var plot = data.text().trim();
        json.plot = plot;
      });

      $(".cast_list").filter(function () {
        var data = $(this);
        var cast = data.children().first().text().trim();
        var newCast = cast.replace(/[\n]+/g, "").trim();
        var newCast1 = newCast
          .replace("Cast overview, first billed only: ", "")
          .trim();
        json.cast = newCast1
          .replace(
            /['                                ...                              ']+/g,
            " "
          )
          .trim();
      });

      $(".article#titleStoryLine").filter(() => {
        var data = $(this);
        var storyline = $(".inline.canwrap")
          .children("p")
          .children("span")
          .text()
          .trim();
        var keywords = $(".see-more.inline.canwrap").children("a").text();
        json.storyline = storyline.trim();
        json.keywords = keywords.trim().replace(/[" "]+/g, ", ");
      });

      $(".article#titleDetails").filter(() => {
        var data = $(this);
        var lo = $("div.txt-block").eq(8).text();
        var loc = lo.replace(/[\n]+/g, "");
        var loca = loc.replace("Filming Locations:", "");
        var locat = loca.replace("»", "");
        json.filming_locations = locat.replace("See more", "").trim();

        var l = $("div.txt-block").eq(5).text();
        var la = l.replace(/[\n]+/g, "");
        var lan = la.replace("Language:", "");
        var lang = lan.replace(/['            |        ']+/g, ", ").trim();
        var langu = lang.replace("|", "");
        json.language = langu.substring(0, langu.length - 1).trim();

        var c = $("div.txt-block").eq(4).text();
        var co = c.replace(/[\n]+/g, "");
        var cou = co.replace("Country:", "");
        var coun = cou.replace("»", "");
        json.country = coun.replace("See more", "").trim();
      });
    }

    res.json(JSON.parse(JSON.stringify(json)));
  });
});

app.listen("8081");
console.log("http://localhost:8081");
// exports = module.exports = app;
