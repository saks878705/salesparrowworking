var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    company_name:{
        type:String,
        required:'This is mendatory',
    },
    phone:{
        type:Number,
        required:'This is mendatory',
    },
    password:{
        type:String,
        default:""
    },
    email:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    state:{
        type:String,
        default:""
    },
    pincode:{
        type:Number,
        default:""
    },
    GSTNo:{
        type:Number,
        default:""
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
},{strict:false});
 module.exports = mongoose.model('AdminInfo',AdminSchema);