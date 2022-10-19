const express = require("express");
const mongoose = require("mongoose");
const EmployeeTarget = mongoose.model("EmployeeTarget");
const Location = mongoose.model("Location");
const Employee = mongoose.model("Employee");
const Party = mongoose.model("Party");
const router = express.Router();

function get_current_date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (today = yyyy + "-" + mm + "-" + dd + " " + time);
  };

router.post('/addEmpTarget',(req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var state = req.body.state?req.body.state:"";
    var employee = req.body.employee?req.body.employee:"";
    var date = req.body.date?req.body.date:"";
    var party = req.body.party?req.body.party:"";
    var primTarget = req.body.primTarget?req.body.primTarget:"";
    var secTarget = req.body.secTarget?req.body.secTarget:"";
    if(state!=""){
        if(employee!=""){
            if(date!=""){
                if(party!=""){
                    if(primTarget!=""){
                        var new_target = new EmployeeTarget({
                            state_id:state,
                            employee_id:employee,
                            party_id:party,
                            company_id:company_id,
                            month:date,
                            primary_target:primTarget,
                            Secondary_target:secTarget,
                            Created_date:get_current_date(),
                            Updated_date:get_current_date(),
                            status:"Active"
                        });
                        new_target.save().then(data=>{
                            res.status(200).json({
                                status:true,
                                message:"Employee Target has been saved",
                                result:data
                            });
                        })
                    }else{
                        res.json({
                            status:false,
                            message:"Primary Target is Required"
                        })
                    }
                }else{
                    res.json({
                        status:false,
                        message:"Party ID is required"
                    })
                }
            }else{
                res.json({
                    status:false,
                    message:"Date must be given"
                })
            }
        }else{
            res.json({
                status:false,
                message:"Employee ID must be provided"
            })
        }
    }else{
        res.json({
            status:false,
            message:"State ID must be given"
        })
    }
});

router.patch('/editTarget',(req,res)=>{
    var target_id = req.body.target_id?req.body.target_id:"";
    if(target_id!=""){
        EmployeeTarget.find({_id:target_id}).exec().then(target_data=>{
            var updated_target = {};
            if(req.body.state){
                updated_target.state_id = req.body.state;
            }
            if(req.body.party){
                updated_target.party_id = req.body.party;
            }
            if(req.body.primTarget){
                updated_target.primary_target = req.body.primTarget;
            }
            if(req.body.secTarget){
                updated_target.Secondary_target = req.body.secTarget;
            }
            if(req.body.date){
                updated_target.month = req.body.date;
            }
            if(req.body.employee){
                updated_target.employee_id = req.body.employee;
            }
            updated_target.Updated_date = get_current_date();
            EmployeeTarget.findOneAndUpdate({_id:target_id},updated_target,{new:true},(err,doc)=>{
                if (doc) {
                    res.status(200).json({
                      status: true,
                      message: "Update successfully",
                      results: updated_target,
                    });
                  }
            })
        })
    }
});

router.get('/getStateWiseEmployee',(req,res)=>{
    var state_id = req.body.state_is?req.body.state_id:"";
    Location.find({_id:state_id}).exec().then(location_data=>{
        Employee.find({state:location_data[0].name}).exec().then(employee_data=>{
            res.json({
                status:true,
                message:"These sre the employees active in this state",
                result:employee_data
            })
        })
    })
});

router.get('/getEmpTarget',(req,res)=>{
    var target_id = req.body.target_id?req.body.target_id:"";
    EmployeeTarget.find({_id:target_id}).exec().then(target_data=>{
        res.json({
            status:true,
            message:"Target details are here",
            details:target_data
        })
    })
});

router.get('/getAllEmpTargets',(req,res)=>{
    EmployeeTarget.find().exec().then(data=>{
        res.json({
            status:true,
            message:"All Employees Trgets are here",
            result:data
        })
    })
});



module.exports = router;
