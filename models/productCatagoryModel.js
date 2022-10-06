const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product_catagory_model = new Schema({
    productCatagory:{
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

module.exports = mongoose.model('ProductCatagory',product_catagory_model)