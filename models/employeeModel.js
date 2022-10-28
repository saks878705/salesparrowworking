const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employee_schema = new Schema({
    employeeName:{
        type:String,
        require:true
    },
    companyId:{
        type:String
    },
    roleId:{
        type:String
    },
    role:{
        type:String,
        default:"SA"
    },
    manager:{
        type:String
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
    userExpenses:{
        type:Object,
        /*basicSalary:{
            type:String
        },
        convyenceSalary:{
            type:String
        },
        takm:{
            type:String
        },
        da:{
            type:String
        },*/
    },
    // transportWay:{
    //     type:String
    // },
    transportWays:{
        type:Object,
        /*hraSalary:{
            type:String
        },
        takmPubTrans:{
            type:String
        },
        type:{
            type:String
        },
        takmBike:{
            type:String
        },
        nightMaxAllowance:{
            type:String
        },*/
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