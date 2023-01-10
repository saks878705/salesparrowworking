const express = require("express");
const mongoose = require("mongoose");
const SalesReport = mongoose.model("SalesReport");
const ExpenseReport = mongoose.model("ExpenseReport");
const Visit = mongoose.model("Visit");
const Order = mongoose.model("Order");
const router = express.Router();
const jwt = require("jsonwebtoken");
const base_url = "https://salesparrow.teknikoglobal.com/";
const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: "images/expense_bill_img",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now());
  },
});

const imageUpload = multer({
  storage: imageStorage,
}).single("expense_bill_img");


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

router.post('/submit_expense_report',(req,res)=>{
  imageUpload(req, res, async (err) => {
    console.log("file",req.file);
    console.log("body",req.body);
    if (!req.file) return res.status(201).json({ status: true, message: "File not found"});
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.json({ status: false, message: "Token is required" });
    let x = token.split(".");
    if (x.length < 3) return res.send({ status: false, message: "Invalid token" });
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    let ta_amount = req.body.ta_amount?req.body.ta_amount:"";
    let da_amount = req.body.da_amount?req.body.da_amount:"";
    let hotel = req.body.hotel?req.body.hotel:"";
    let stationary = req.body.stationary?req.body.stationary:"";
    let misc_amount = req.body.misc_amount?req.body.misc_amount:"";
    let total_claim_amount = req.body.total_claim_amount?req.body.total_claim_amount:"";
    if(ta_amount=="") return res.json({status:false,message:"Please give TA"})
    if(da_amount=="") return res.json({status:false,message:"Please give DA"})
    if(total_claim_amount=="") return res.json({status:false,message:"Please give total amount"})
    let new_expense_report =await ExpenseReport.create({
      employee_id:employee_id,
      ta_amount:ta_amount,
      da_amount:da_amount,
      stationary:stationary,
      hotel:hotel,
      misc_amount:misc_amount,
      total_claim_amount:total_claim_amount,
      attachment:`${base_url}${req.file.path}`,
      Created_date:get_current_date(),
      Updated_date:get_current_date(),
      status:"Active",
    })
    return res.json({status:true,message:"submitted successfully",result:new_expense_report})
  })
})

module.exports = router;