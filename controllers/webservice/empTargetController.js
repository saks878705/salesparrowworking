const express = require("express");
const mongoose = require("mongoose");
const EmployeeTarget = mongoose.model("EmployeeTarget");
const Location = mongoose.model("Location");
const Employee = mongoose.model("Employee");
const Party = mongoose.model("Party");
const router = express.Router();
const jwt = require("jsonwebtoken")

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
    if(!token){
        res.json({
            status:false,
            message:"Token is required"
        })
    }
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
            if(req.body.status){
                updated_target.status = req.body.status;
            }
            if(req.body.is_delete){
                updated_target.is_delete = req.body.is_delete;
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

router.post('/getAllEmpTargets',async (req,res)=>{
    var state = req.body.state?req.body.state:"";
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        res.json({
            status:false,
            message:"Token is required"
        })
    }
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var list = [];
    var count = await EmployeeTarget.find({company_id});
    var limit = 10;
    var page = req.body.page?req.body.page:"1";
    if(state!=""){
        EmployeeTarget.find({$and:[{company_id},{state_id:state}]}).limit(limit*1).skip((page-1)*limit).exec().then(data=>{
            let counInfo = 0;
            if(data.length>0){
                for(let i=0;i<data.length;i++){
                    Location.findOne({_id:data[i].state_id}).exec().then(state_data=>{
                        Employee.findOne({_id:data[i].employee_id}).exec().then(emp_data=>{
                            Party.findOne({_id:data[i].party_id}).exec().then(async (party_data)=>{
                                await (async function(rowData){
                                    var u_data = {
                                        id:rowData._id,
                                        state:state_data.name,
                                        employee_name:emp_data.employeeName,
                                        party_name:party_data.firmName,
                                        date:rowData.month,
                                        primary_target:rowData.primary_target,
                                        secondary_target:rowData.secondary_target || "",
                                    };
                                    list.push(u_data);
                                })(data[i])
                                counInfo++;
                                if(counInfo==data.length){
                                    res.json({
                                        status:true,
                                        message:"Employee target list is here",
                                        result:list,
                                        pageLength:Math.ceil(count.length/limit)
                                    })
                                }
                            })
                        })
                    })
                }
            }else{
                res.json({
                    status:true,
                    message:"No employee targets are found",
                    result:[]
                })
            }
        })
    }else{
        EmployeeTarget.find({company_id}).limit(limit*1).skip((page-1)*limit).exec().then(data=>{
            let counInfo = 0;
            if(data.length>0){
                for(let i=0;i<data.length;i++){
                    Location.findOne({_id:data[i].state_id}).exec().then(state_data=>{
                        Employee.findOne({_id:data[i].employee_id}).exec().then(emp_data=>{
                            Party.findOne({_id:data[i].party_id}).exec().then(async (party_data)=>{
                                await (async function(rowData){
                                    var u_data = {
                                        id:rowData._id,
                                        state:state_data.name,
                                        employee_name:emp_data.employeeName,
                                        party_name:party_data.firmName,
                                        date:rowData.month,
                                        primary_target:rowData.primary_target,
                                        secondary_target:rowData.secondary_target || "",
                                    };
                                    list.push(u_data);
                                })(data[i])
                                counInfo++;
                                if(counInfo==data.length){
                                    res.json({
                                        status:true,
                                        message:"Employee target list is here",
                                        result:list,
                                        pageLength:Math.ceil(count.length/limit)
                                    })
                                }
                            })
                        })
                    })
                }
            }else{
                res.json({
                    status:true,
                    message:"No employee targets are found",
                    result:[]
                })
            }
        })
    }
});

router.delete('/deleteEmpTarget',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    EmployeeTarget.findOneAndDelete({_id:id}).exec().then(()=>{
        res.json({
            status:true,
            message:"Employee deleted successfully",
        })
    })
})



module.exports = router;
