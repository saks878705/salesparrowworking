const express = require("express");
const mongoose = require("mongoose");
const SalesReport = mongoose.model("SalesReport");
const Visit = mongoose.model("Visit");
const Order = mongoose.model("Order");
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

router.get('/get_todays_sales',async (req,res)=>{
    const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json({ status: false, message: "Token is required" });
  let x = token.split(".");
  if (x.length < 3)
    return res.send({ status: false, message: "Invalid token" });
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  let date = get_current_date().split(" ")[0];
  let completd_market_visit_data = await Visit.find({emp_id:employee_id,visit_date:date,visit_status:"Completed"})
  let productive_market_visit_data = await Visit.find({emp_id:employee_id,visit_date:date,visit_status:"Completed",order_status:"Productive"})
  if(completd_market_visit_data.length<1) return res.json({status:true,message:"You haven't completed any visit"})
  let tc = completd_market_visit_data.length;
  let pc = productive_market_visit_data.length;
  let sale_amount = 0;
  for(let i = 0;i<productive_market_visit_data.length;i++){
    let order_data = await Order.findOne({$and: [{ retailer_id: productive_market_visit_data.retailer_id }, { order_date: date }],})
    sale_amount += parseInt(order_data.total_amount);
  }
  let data = {
    tc:tc,
    pc:pc,
    sale_amount:sale_amount
  }
  return res.json({status:true,message:"data",result:data})

})

router.post('/create_sales_report',async (req,res)=>{
    const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json({ status: false, message: "Token is required" });
  let x = token.split(".");
  if (x.length < 3)
    return res.send({ status: false, message: "Invalid token" });
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  let tc = req.body.tc?req.body.tc:""
  let pc = req.body.pc?req.body.pc:""
  let sales_amount = req.body.sales_amount?req.body.sales_amount:""
  let date = get_current_date().split(" ")[0];
  let new_sales_report = await SalesReport.create({
    tc:tc,
    pc:pc,
    sales_amount:sales_amount,
    employee_id:employee_id,
    sales_report_date:date,
    Created_date:get_current_date(),
    Updated_date:get_current_date(),
    status:"Active",
  })
  return res.json({status:true,message:"Sales report submitted successfully",result:new_sales_report})
})

module.exports = router;