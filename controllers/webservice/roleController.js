const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Role = mongoose.model("role");

function get_current_date() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (today = yyyy + "-" + mm + "-" + dd + " " + time);
}

router.post('/addRole',(req,res)=>{
    var rolename = req.body.rolename?req.body.rolename:"";
    var hierarchy_level = req.body.hierarchy_level?req.body.hierarchy_level:"";
    var status = req.body.status?req.body.status:"";
    if(rolename!=""){
        if(hierarchy_level!=""){
            var new_role = new Role({
                rolename:rolename,
                hierarchy_level:hierarchy_level,
                Created_date:get_current_date(),
                Updated_date:get_current_date(),
                status:status
            })
            new_role.save().then((data)=>{
                res.status(200).json({
                    status:true,
                    message:"Role created successfully",
                    details:data
                })
            });
        }else{
            res.json({
                status:false,
                message:"please provide the hierarchy_level"
            })
        }
    }else{
        res.json({
            status:false,
            message:"please provide the role"
        })
    }
});

router.get('/getAllRoles',(req,res)=>{
    Role.find().exec().then(role_data=>{
        res.status(200).json({
            status:true,
            message:"Roles fetched succesfully",
            result:role_data
        })
    })
});

module.exports = router;