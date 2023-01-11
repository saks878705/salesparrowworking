const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Party = mongoose.model("Party");
const PrimaryOrder = mongoose.model("PrimaryOrder");
// const ProductVarient = mongoose.model("ProductVarient");
const PrimaryOrderItem = mongoose.model("PrimaryOrderItem");
const router = express.Router();
const base_url = "https://salesparrow.teknikoglobal.com/";
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

router.post('/place_primary_order',async (req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.json({ status: false, message: "Token is required" });
    let x = token.split(".");
    if (x.length < 3) return res.send({ status: false, message: "Invalid token" });
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    let emp_data = Employee.findOne({_id:employee_id});
    if(!emp_data) return res.json({status:false,message:"Employee not found"})
    let party_type_id = req.body.party_type_id?req.body.party_type_id:"";
    let party_id = req.body.party_id?req.body.party_id:"";
    let line = req.body.line?req.body.line:null;
    if(emp_data.status=="InActive" || emp_data.status=="UnApproved") return res.json({status:false,message:`You are ${emp_data.status} . Please contact company.`})
    if(party_type_id=="") return res.json({status:false,message:"Give party type"});
    if(party_id=="") return res.json({status:false,message:"Give party "});
    if(line==null) return res.json({status:false,message:"Please select atleast one product"});
    let date = get_current_date().split(" ")[0];
    let total_amount = 0;
    for(let i = 0;i<line.length;i++){
        total_amount += line[i].product_price * line[i].quantity;
    }
    console.log("total_amount-----",total_amount)
    let new_order = await PrimaryOrder.create({
        emp_id:employee_id,
        company_id:emp_data.companyId,
        party_type_id:party_type_id,
        order_date:date,
        party_id:party_id,
        total_amount:total_amount,
        Created_date:get_current_date(),
        Updated_date:get_current_date(),
        status:"Active",
    });
    let list = [];
    for(let i = 0;i<line.length;i++){
        let new_primary_order_line =await PrimaryOrderItem.create({
            order_id:new_order._id,
            product_id:line[i].product_id,
            product_price:line[i].product_price,
            quantity:line[i].quantity,
            sub_total_price:line[i].product_price * line[i].quantity,
            Created_date:get_current_date(),
            Updated_date:get_current_date(),
            status:"Active",
        })
        list.push(new_primary_order_line);
    }
    return res.json({status:true,message:"Order placed successfully",result:new_order,list})
});

router.post('/party_acc_to_partytype',async (req,res)=>{
    let partytype_id = req.body.partytype_id?req.body.partytype_id:"";
    if(partytype_id=="") return res.json({status:false,message:"Please give party type"})
    let party_data = await Party.find({partyType:partytype_id});
    if(party_data.length<1) return res.json({status:true,message:"No data",result:[]})
    return res.json({status:true,message:"data",result:party_data})   
})

module.exports = router;