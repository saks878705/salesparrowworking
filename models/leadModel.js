const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lead_model = new Schema({
    leadName:{
        type:String
    },
    displayName:{
        type:String
    },
    mobileNumber:{
        type:String
    },
    email:{
        type:String
    },
    pincode:{
        type:String
    },
    state:{
        type:String
    },
    // district:{
    //     type:String
    // },
    city:{
        type:String
    },
    leadSource:{
        type:String
    },
    addBy:{
        type:String
    },
    note:{
        type:String
    },
    assignToEmp:{
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

module.exports = mongoose.model('Lead',lead_model)