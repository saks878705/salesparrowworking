const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beat_schema = new Schema({
    beatName:{
        type:String,
    },
    pincode:{
        type:Number
    },
    state:{
        type:String
    },
    area:{
        type:String
    },
    city:{
        type:String
    },
    district:{
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

module.exports = mongoose.model('Beat',beat_schema)
