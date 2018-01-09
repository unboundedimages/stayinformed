var express = require("express");
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 8080;
var app = express();

//middleware
app.use(logger("dev")); //morgan
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine', '.handlebars');
app.use(express.static("public"));
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/stayinformed";
mongoose.connect(MONGODB_URI, {
   // useMongoClient: true
});
// mongoose.connect("mongodb://localhost/stayinformed", {
// useMongoClient: true
// });

// Routes
app.get("/scrape", function(req, res) {
   axios.get("https://www.wsj.com/news/technology").then(function(response) {
      var $ = cheerio.load(response.data);

      $(".wsj-headline-link").each(function(i, element) {
         // console.log(element);
         var result = {};

         result.headlines = $(this).text()
         result.url = $(this).attr("href")
         result.summary = $(this).parent().parent().find("p.wsj-summary ").find("span").text();
         // result.photos = $(this).parent().parent().parent().find("img.wsj-img-content").attr("src").trim("src")
         result.photos = $(this).parent().parent().parent().children().children().children().attr("content");
         // console.log(result.photos);


         db.Article //Creates new articles
            .create(result)
            .then(function(dbArticle) {
               console.log(dbArticle);
            })
            .catch(function(err) {
               res.json(err);
            });
      });
   });
   res.send("Got it baby ");
});
//Get route
app.get("/", function(req, res) {
   // res.send("I did a get route to here, but point this to the index.hbs when you get it working");

   res.render("index");
});
app.get("/articles", function(req, res) {
   db.Article
      .find({})
      .then(function(dbArticle) {
         // res.json(dbArticle);
         res.render("index", { Articles: dbArticle })
      })
      .catch(function(err) {
         res.json(err);
      });
});

app.get("/articles/:id", function(req, res) {
   db.Article
      .findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
         res.json(dbArticle);
      })
      .catch(function(err) {
         res.json(err);
      });
});

app.post("/articles/:id", function(req, res) {
   db.Note
      .create(req.body)
      .then(function(dbNote) {
         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
         res.json(dbArticle);
      })
      .catch(function(err) {
         res.json(err);
      });
});
app.listen(PORT, function() {
   console.log("App running on port " + PORT + "!");
});
