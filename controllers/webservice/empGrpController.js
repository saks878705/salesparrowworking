const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Employee = mongoose.model("Employee");
const EmployeeGrouping = mongoose.model("EmployeeGrouping");

function get_current_date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (today = yyyy + "-" + mm + "-" + dd + " " + time);
};

router.get('/getStateEmployee',(req,res)=>{
    var state = req.body.state?req.body.state:"";
    if(state!=""){
        console.log(state)
        Employee.find({state:state}).exec().then(employee_data=>{
            res.json({
                status:true,
                message:"All Employees of this state found successfully",
                result:employee_data
            })
        })
    }else{
        console.log(state)
        Employee.find().exec().then(employee_data=>{
            res.json({
                status:true,
                message:"All Employees found successfully",
                result:employee_data
            })
        })
    }
});

router.post('/addEmpGrp',(req,res)=>{
    var employees = req.body.employees?req.body.employees:"";
    var group_name = req.body.group_name?req.body.group_name:"";
    var group_description = req.body.group_description?req.body.group_description:"";
    if(employees!=""){
        if(group_name!=""){
            EmployeeGrouping.find({empGroupName:group_name}).exec().then(data=>{
                if(data.length<1){
                    var new_emp_grp = new EmployeeGrouping({
                        empGroupName:group_name,
                        empGrpDescription:group_description,
                        employees:employees,
                        Created_date:get_current_date(),
                        Updated_date:get_current_date(),
                        status:"Active"
                    });
                    new_emp_grp.save().then(doc=>{
                        res.json({
                            status:true,
                            message:"Employee Grouping is created succesffully",
                            result:doc
                        });
                    });
                }else{
                    res.json({
                        status:false,
                        message:"Group Name already exists.Please think about another one."
                    })
                }
            })
        }else{
            res.json({
                status:false,
                message:"Group Name is required",
                result:null
            });
        }
    }else{
        res.json({
            status:false,
            message:"Atleast two Employees  is required",
            result:null
        });
    }
})

module.exports = router;