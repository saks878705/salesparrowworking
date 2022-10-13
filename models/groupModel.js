const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const grp_schema = new Schema({
    grp_name:{
        type:String,
    },
    grp_description:{
        type:String,
    },
    company_id:{
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

module.exports = mongoose.model('Group',grp_schema)
