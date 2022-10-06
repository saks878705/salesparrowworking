const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const banner_model = new Schema({
    bannerType:{
        type:String
    },
    bannerName:{
        type:String
    },
    date:{
        type:String
    },
    poster:{
        type:String
    },
    Created_date: {
        type: String,
        default: ""
    },
    Updated_date: {
        type: String,
        default: ""
    },
    is_delete: {
        type: String,
        default: "0"
    },
    status: {
        type: String,
        default:'InActive'
    }
});

module.exports = mongoose.model('Banner',banner_model)