const express = require("express");
const mongoose = require("mongoose");
const Check = mongoose.model("Check");
const Employee = mongoose.model("Employee");
const router = express.Router();
const jwt = require("jsonwebtoken");

function get_current_date() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (today = yyyy + "-" + mm + "-" + dd + " " + time);
}

router.post('/check_in',async (req,res)=>{
    console.log(req.body);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.json({status: false,message: "Token must be provided",});
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    let location = req.body.location?req.body.location:null;
    let employee = await Employee.findOne({_id:employee_id});
    if(!employee) return res.json({status: false,message: "Employee not found",});
    if(employee.status == "InActive" || employee.status == "UnApproved") return res.json({status: false,message: `you are ${employee.status}. Contact company.`,});
    if(location==null) return res.json({status:false,message:"Provide the location"});
    // let today= new Date().toLocaleDateString("en-IN", {
    //   year: "2-digit",
    //   month: "2-digit",
    //   day: "2-digit",
    //   hour: "2-digit",
    //   minute: "2-digit",
    // })
    // let a = today.split(",")
    let date = get_current_date().split(" ")[0];
    // var time =a[1];
    // console.log(time);
    let check =await Check.findOne({$and:[{check_in_date:date},{emp_id:employee_id}]});
    if(check) return res.json({status:false,message:"Already checked inn",result:check})
    let new_check_in = new Check({
        emp_id:employee_id,
        check_in_time:new Date(),
        check_in_date:date,
        location:location,
        Created_date:get_current_date(),
        Updated_date:get_current_date(),
        status:"Active"
    });
    new_check_in.save().then((doc)=>{
        if(doc) return res.json({status:true,message:"Check_In Successful",result:doc})
    })
});

module.exports = router;