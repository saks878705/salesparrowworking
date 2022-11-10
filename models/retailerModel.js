const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const retailer_schema = new Schema({
    beat_id:{
        type:String,
    },
    customer_type:{
        type:String,
    },
    company_id:{
        type:String,
    },
    employee_id:{
        type:String,
    },
    pincode:{
        type:Number
    },
    address:{
        type:String
    },
    firmName:{
        type:String
    },
    GSTNo:{
        type:Number
    },
    customerName:{
        type:String
    },
    area:{
        type:String
    },
    location:{
        type:Array
    },
    mobileNo:{
        type:Number
    },
    DOB:{
        type:String
    },
    DOA:{
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

module.exports = mongoose.model('Retailer',retailer_schema)