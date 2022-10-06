const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emp_grp_schema = new Schema({
    empGroupName:{
        type:String,
    },
    empGrpDescription:{
        type:String,
    },
    employees:{
        type:Array
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

module.exports = mongoose.model('EmployeeGrouping',emp_grp_schema)
