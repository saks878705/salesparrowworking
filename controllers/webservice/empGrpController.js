const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Group = mongoose.model("Group");
const EmployeeGrouping = mongoose.model("EmployeeGrouping");
const jwt = require("jsonwebtoken");

function get_current_date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (today = yyyy + "-" + mm + "-" + dd + " " + time);
};


router.post('/addEmpGrp',(req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var empIdStr = req.body.empIdStr?req.body.empIdStr:"";
    var empIdArr = empIdStr.split(",");
    var grp_name = req.body.grp_name?req.body.grp_name:"";
    var state = req.body.state?req.body.state:"";
    var grp_description = req.body.grp_description?req.body.grp_description:"";
    if(grp_name!=""){
        if(grp_description!=""){
            Group.find({grp_name}).exec().then(data=>{
                if(data.length<1){
                    var new_grp = new Group({
                        grp_name:grp_name,
                        grp_description:grp_description,
                        company_id:company_id,
                        state:state,
                        Created_date:get_current_date(),
                        Updated_date:get_current_date(),
                        status:"Active"
                    });
                    new_grp.save().then(doc=>{
                        if(doc){
                            Group.findOne({grp_name}).exec().then(async (data)=>{
                                for(let i = 0; i < empIdArr.length; i++){
                                    var new_emp_grp = new EmployeeGrouping({
                                        grp_id:data._id,
                                        emp_id:empIdArr[i],
                                        company_id:company_id,
                                        Created_date:get_current_date(),
                                        Updated_date:get_current_date(),
                                        status:"Active"
                                    });
                                    await new_emp_grp.save()
                                }
                                EmployeeGrouping.find({grp_id:data._id}).exec().then(egdata=>{
                                    res.json({
                                        status:true,
                                        message:"Employee group created succesfully",
                                        grpDetails:data,
                                        empGrpDetails:egdata
                                    });
                                });
                            });
                        }else{
                            res.json({
                                status:false,
                                message:"Employee group not saved successfully."
                            })
                        }
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
});

router.post('/empGrpList',async (req,res)=>{
    var state = req.body.state?req.body.state:"";
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var page = req.body.page?req.body.page:"1";
    let count =await Group.find()
    var limit = 10;
    if(state!=""){
        Group.findOne({$and:[{state},{company_id}]}).limit( limit * 1).skip( (page - 1) * limit).exec().then(group_data=>{
            if(group_data){
                res.json({
                    status:true,
                    message:"Employee groups of this state listed successfully.",
                    result:group_data,
                    pageLength:Math.ceil(count.length/limit)
                })
            }else{
                res.json({
                    status:false,
                    message:"No EmpGroup found in thid state for this org."
                })
            }
        })
    }else{
        Group.findOne({company_id}).limit( limit * 1).skip( (page - 1) * limit).exec().then(group_data=>{
            if(group_data){
                res.json({
                    status:true,
                    message:"Employee groups of this state listed successfully.",
                    result:group_data,
                    pageLength:Math.ceil(count.length/limit)
                })
            }else{
                res.json({
                    status:false,
                    message:"No EmpGroup found for this org."
                })
            }
        })
    }
});

module.exports = router;