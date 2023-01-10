const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const new_primary_order_schema = new Schema({
    emp_id:{
        type:String,
    },
    company_id:{
        type:String,
    },
    party_type_id:{
        type:String,
    },
    order_date:{
        type:String,
    },
    party_id:{
        type:String,
    },
    total_amount:{
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

module.exports = mongoose.model('PrimaryOrder',new_primary_order_schema)