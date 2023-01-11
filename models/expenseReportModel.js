const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseReportSchema = new Schema({
    employee_id:{
        type:String
    },
    ta_amount:{
        type:String
    },
    da_amount:{
        type:String
    },
    stationary:{
        type:String
    },
    hotel:{
        type:String
    },
    misc_amount:{
        type:String
    },
    total_claim_amount:{
        type:String
    },
    attachment:{
        type:String
    },
    travelled_distance:{
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

module.exports = mongoose.model('ExpenseReport',expenseReportSchema)