const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employee_target_schema = new Schema({
    state_id:{
        type:String
    },
    company_id:{
        type:String
    },
    employee_id:{
        type:String
    },
    party_id:{
        type:String
    },
    month:{
        type:String
    },
    primary_target:{
        type:String
    },
    Secondary_target:{
        type:String,
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

module.exports = mongoose.model('EmployeeTarget',employee_target_schema)