const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employee_schema = new Schema({
    employeeName:{
        type:String,
        require:true
    },
    phone:{
        type:String
    },
    email:{
        type:String,
    },
    address:{
        type:String
    },
    pincode:{
        type:Number
    },
    state:{
        type:String
    },
    image:{
        type:String
    },
    city:{
        type:String
    },
    district:{
        type:String
    },
    experience:{
        type:String
    },
    qualification:{
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

module.exports = mongoose.model('Employee',employee_schema)