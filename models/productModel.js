const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product_model = new Schema({
    productCatagory_id:{
        type:String
    },
    productName:{
        type:String
    },
    tax:{
        type:Number
    },
    SKU_ID:{
        type:String
    },
    HSN_Code:{
        type:String
    },
    productImage:{
        type:String
    },
    pricing_details:{
        type:Array,
        /*MRP:{
            type:Number
        },
        Distributor:{
            type:Array
        },
        Retailer:{
            type:Array
        },
        SS:{
            type:Array
        }*/
    },
    packing_details:{
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

module.exports = mongoose.model('Product',product_model)