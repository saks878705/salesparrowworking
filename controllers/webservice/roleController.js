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
    if(rolename!=""){
        Role.findOne({rolename:rolename}).exec().then(role_data=>{
            if(role_data ){
                res.json({
                    status:false,
                    message:"Role already exists.Please define a different role."
                })
            }else{
                var new_role = new Role({
                    rolename:rolename,
                    Created_date:get_current_date(),
                    Updated_date:get_current_date(),
                    status:"Active"
                })
                new_role.save().then((data)=>{
                    res.status(200).json({
                        status:true,
                        message:"Role created successfully",
                        details:data
                    })
                });
            }
        })
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
            message:"Roles etched succesfully",
            result:role_data
        })
    })
});

module.exports = router;