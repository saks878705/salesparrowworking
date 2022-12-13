const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Retailer = mongoose.model("Retailer");
const Beat = mongoose.model("Beat");
const Order = mongoose.model("Order");
const Attendance = mongoose.model("Attendance");
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

// router.post('/party_acc_to_beat',async (req,res)=>{
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];
//     if (!token)
//       return res.json({ status: false, message: "Token is required" });
//     let x = token.split(".");
//     if (x.length < 3)
//       return res.send({ status: false, message: "Invalid token" });
//     var decodedToken = jwt.verify(token, "test");
//     var employee_id = decodedToken.user_id;
//     let emp_data = await  Employee.findOne({_id:employee_id});
//     // console.log("emp_data",emp_data)
//     if(!emp_data) return res.json({status:false,message:"No employee data"});
//     let id = req.body.id?req.body.id:"";
//     if(id=="") return res.json({status:false,message:"Please give id"})
//     let beat_data =await Beat.findOne({_id:id});
//     // console.log("beat_data",beat_data)
//     if(!beat_data) return res.json({status:false,message:"No beat data. Please check id"});
//     let party_data = await Party.find({company_id:emp_data.companyId});
//     // console.log("party_data",party_data.length)
//     if(party_data.length<1) return res.json({status:true,message:"No data"});
//     let count = 0;
//     let list = [];
//     for(let i = 0;i<party_data.length;i++){
//         console.log(party_data[i])
//         console.log(party_data[i].route)
//         if(party_data[i].route==null){
//           count++
//           continue;

//         }else{
//           var arr = party_data[i].route[0]?party_data[i].route[0].split(","):"";
//           if(arr==""){
//             console.log("inside first if")
//             if(count==party_data.length-1 && list == []) return res.json({status:true,message:"No parties found",result:[]})
//             if(count==party_data.length-1 && list != []) return res.json({status:true,message:"parties found",result:list})
//           }else{
//             console.log("insidde else");
//             console.log(arr.length);
//             for(let j = 0;j<arr.length;j++){
//               console.log("inside for");
//               if(arr[j]==beat_data.route_id){
//                 console.log("insidde if");
//                 list.push(party_data[i])
//               }
//             }
//             console.log("list",list)
//           }
//         }
//         count++;
//         console.log("count",count)
//       }
//       if(count==party_data.length) return res.json({status:true,message:"parties found",result:list})
// });


router.post('/retailer_acc_to_beat',async (req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.json({ status: false, message: "Token is required" });
    let x = token.split(".");
    if (x.length < 3)
      return res.send({ status: false, message: "Invalid token" });
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    let emp_data = await  Employee.findOne({_id:employee_id});
    // console.log("emp_data",emp_data)
    if(!emp_data) return res.json({status:false,message:"No employee data"});
    let id = req.body.id?req.body.id:"";
    if(id=="") return res.json({status:false,message:"Please give id"})
    let beat_data =await Beat.findOne({_id:id});
    // console.log("beat_data",beat_data)
    if(!beat_data) return res.json({status:false,message:"No beat data. Please check id"});
    let retailer_data = await Retailer.find({company_id:emp_data.companyId});
    // console.log("party_data",party_data.length)
    if(retailer_data.length<1) return res.json({status:true,message:"No data"});
    let count = 0;
    let list = [];
    for(let i = 0;i<retailer_data.length;i++){
        console.log(retailer_data[i])
        console.log(retailer_data[i].route)
        if(retailer_data[i].route==null){
          count++
          continue;

        }else{
          var arr = retailer_data[i].route[0]?retailer_data[i].route[0].split(","):"";
          console.log("arr",arr)
          if(arr==""){
            console.log("inside first if")
            if(count==retailer_data.length-1 && list == []) return res.json({status:true,message:"No parties found",result:[]})
            if(count==retailer_data.length-1 && list != []) return res.json({status:true,message:"Retailers found",result:list})
          }else{
            console.log("insidde else");
            console.log(arr.length);
            for(let j = 0;j<arr.length;j++){
              console.log("inside for");
              if(arr[j]==beat_data.route_id){
                // let order_details = await Order.find({retailer_id:retailer_data[i]._id})
                let order_detail = await Order.findOne({retailer_id:retailer_data[i]._id}).sort({order_date:-1})
                if(order_detail){
                  console.log("insidde if");
                  list.push({retailer_data:retailer_data[i],last_visit:order_detail.order_date,total_order_amount:order_detail.total_amount})
                }else{
                  list.push({retailer_data:retailer_data[i],last_visit:"NA",total_order_amount:"NA"})

                }
              }
            }
            console.log("list",list)
          }
        }
        count++;
        console.log("count",count)
      }
      if(count==retailer_data.length) return res.json({status:true,message:"Retailers found",result:list})
});

router.get('/get_todays_beat',async (req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.json({ status: false, message: "Token is required" });
    let x = token.split(".");
    if (x.length < 3)
      return res.send({ status: false, message: "Invalid token" });
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    let date = get_current_date().split(" ")[0];
    let todays_attendance_data = await Attendance.findOne({$and:[{emp_id:employee_id},{date:date}]});
    if(!todays_attendance_data) return res.json({status:true,message:"Not punched attendance for today."});
    let beat_data = await Beat.findOne({_id:todays_attendance_data.beat_id});
    if(!beat_data) return res.json({status:true,message:"Beat data not found"});
    return res.json({status:true,message:"data found",result:beat_data})
})

module.exports = router;