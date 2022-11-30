const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product_varient_model = new Schema({
    product_id:{
        type:String
    },
    varient_name:{
        type:String
    },
    mrp:{
        type:String
    },
    price:{
        type:String
    },
    display_image:{
        type:String
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

module.exports = mongoose.model('ProductVarient',product_varient_model)