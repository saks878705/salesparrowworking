const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Product = mongoose.model("Product");
const Order = mongoose.model("Order");
const OrderItem = mongoose.model("OrderItem");
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

router.post('/place_order',async (req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.json({ status: false, message: "Token is required" });
    let x = token.split(".");
    if (x.length < 3) return res.send({ status: false, message: "Invalid token" });
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    let emp_data = Employee.findOne({_id:employee_id});
    if(!emp_data) return res.json({status:false,message:"Employee not found"})
    let party_id = req.body.party_id?req.body.party_id:"";
    let type = req.body.type?req.body.type:"";
    let orderStatus = req.body.orderStatus?req.body.orderStatus:"";
    let line = req.body.line?req.body.line:"";
    if(emp_data.status=="InActive" || emp_data.status=="UnApproved") return res.json({status:false,message:`You are ${emp_data.status} . Please contact company.`})
    if(party_id=="") return res.json({status:false,message:"Give party id"});
    if(type=="") return res.json({status:false,message:"Give type"});
    if(orderStatus=="") return res.json({status:false,message:"Give order status"});
    let date = get_current_date().split(" ")[0];
    let total_amount = 0;
    for(let i = 0;i<line.length;i++){
        total_amount += line[i].product_price * line[i].quantity;
    }
    console.log("total_amount-----",total_amount)
    let new_order = new Order({
        emp_id:employee_id,
        company_id:emp_data.companyId,
        party_id:party_id,
        order_date:date,
        type:type,
        order_status:orderStatus,
        total_amount:total_amount,
        Created_date:get_current_date(),
        Updated_date:get_current_date(),
        status:"Active",
    });
    let new_order_data = await new_order.save();
    let list = [];
    for(let i = 0;i<line.length;i++){
        let new_order_line = new OrderItem({
            order_id:new_order_data._id,
            product_id:line[i].product_id,
            product_price:line[i].product_price,
            quantity:line[i].quantity,
            sub_total_price:line[i].product_price * line[i].quantity,
            order_status:"Pending",
            Created_date:get_current_date(),
            Updated_date:get_current_date(),
            status:"Active",
        })
        list.push(new_order_line);
        await new_order_line.save();
    }
    return res.json({status:true,message:"Order placed successfully",result:new_order_data,list})
});

router.post('/previous_party_orders',async (req,res)=>{
    let id = req.body.id?req.body.id:"";
    if(id=="") return res.json({status:false,message:"Please give id ."});
    let order_data = await Order.find({party_id:id}).sort({Created_date:-1});
    if(order_data.length<1) return res.json({status:true,message:"No data",result:[]});
    return res.json({status:true,message:"Found successfully",result:order_data}); 
});

module.exports = router;