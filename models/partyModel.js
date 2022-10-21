const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const party_schema = new Schema({
    partyType:{
        type:String,
    },
    image:{
        type:String,
    },
    company_id:{
        type:String,
    },
    pincode:{
        type:Number
    },
    state:{
        type:String
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    district:{
        type:String
    },
    firmName:{
        type:String
    },
    GSTNo:{
        type:Number
    },
    contactPersonName:{
        type:String
    },
    mobileNo:{
        type:Number
    },
    email:{
        type:String
    },
    DOB:{
        type:String
    },
    DOA:{
        type:String
    },
    route:{
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

module.exports = mongoose.model('Party',party_schema)