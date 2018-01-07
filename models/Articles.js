var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
    headlines: {
        type: String,
        require: true
    },
    Summary: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    photos: {
        type: String,
        require: true
    }
})
