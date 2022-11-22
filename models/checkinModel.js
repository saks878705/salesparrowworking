const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const check_in_out_schema = new Schema({
    emp_id:{
        type:String
    },
    check_in_time:{
        type:String,
        default: ""
    },
    check_out_time:{
        type:String,
        default: ""
    },
    check_in_date:{
        type:String,
        default: ""
    },
    check_out_date:{
        type:String,
        default: ""
    },
    location:{
        type:Array,
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
})

module.exports = mongoose.model('Check',check_in_out_schema)