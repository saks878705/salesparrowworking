const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendance_schema = new Schema({
    emp_id:{
        type:String
    },
    party_id:{
        type:String
    },
    beat_id:{
        type:String
    },
    activity_id:{
        type:String
    },
    check_in:{
        type:String
    },
    selfie:{
        type:String
    },
    check_out:{
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

module.exports = mongoose.model('Attendance',attendance_schema)