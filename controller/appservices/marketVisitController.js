const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Retailer = mongoose.model("Retailer");
const Visit = mongoose.model("Visit");
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

router.post('/create_visit_summary',async (req,res)=>{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json({ status: false, message: "Token is required" });
  let x = token.split(".");
  if (x.length < 3) return res.send({ status: false, message: "Invalid token" });
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  let str = req.body.str?req.body.str:"";
  let retailer_id = req.body.retailer_id?req.body.retailer_id:"";
  let reason = req.body.reason?req.body.reason:"";
  let beat_id = req.body.beat_id?req.body.beat_id:"";
  if(retailer_id =="") return res.json({status:false,message:"Please provide visit status"})
  if(str =="") return res.json({status:false,message:"Please provide retailer decision"})
  if(beat_id =="") return res.json({status:false,message:"Please provide visit status"})
  let date = get_current_date().split(" ")[0];
  if(str == "visit_later"){
    let new_visit = new Visit({
      emp_id:employee_id,
      beat_id:beat_id,
      retailer_id:retailer_id,
      visit_status:"Progress",
      visit_date:date,
      Created_date:get_current_date(),
      Updated_date:get_current_date(),
      status:"Active",
    })
    let visit_data = await new_visit.save()
    return res.json({status:true,message:"Pending Visit",result:visit_data})

  }else if(str == "no_order"){
    let new_visit = new Visit({
      emp_id:employee_id,
      beat_id:beat_id,
      retailer_id:retailer_id,
      visit_status:"Completed",
      visit_date:date,
      no_order_reason:reason,
      order_status:"Non-Productive",
      Created_date:get_current_date(),
      Updated_date:get_current_date(),
      status:"Active",
    })
    let visit_data = await new_visit.save()
    return res.json({status:true,message:"Completed Visit",result:visit_data})

  }else if(str == "order"){
    let new_visit = new Visit({
      emp_id:employee_id,
      beat_id:beat_id,
      retailer_id:retailer_id,
      visit_status:"Completed",
      visit_date:date,
      order_status:"Productive",
      Created_date:get_current_date(),
      Updated_date:get_current_date(),
      status:"Active",
    })
    let visit_data = await new_visit.save()
    return res.json({status:true,message:"Completed Visit",result:visit_data})
  }
})

router.post('/retailer_acc_to_visit_status',async (req,res)=>{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json({ status: false, message: "Token is required" });
  let x = token.split(".");
  if (x.length < 3) return res.json({ status: false, message: "Invalid token" });
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  let list = [];
  visit_status = req.body.visit_status?req.body.visit_status:"";
  let date = get_current_date().split(" ")[0];
  if(visit_status =="") return res.json({status:false,message:"Please provide visit status"})
  let visit_details_data = await Visit.find({$and:[{visit_date:date},{emp_id:employee_id},{visit_status:visit_status}]})
  if(visit_details_data.length<1) return res.json({ status: true, message: "No data" ,result:[]});
  let count = 0;
  if(visit_status == "Complete"){
    for(let i= 0;i<visit_details_data.length;i++){
      await (async function(rowData){
        let retailer_data = await Retailer.findOne({_id:visit_details_data[i].retailer_id});
        let order_data = await Order.findOne({$and:[{retailer_id:retailer_data._id},{order_date:date}]})
        let u_data = {
          retailer_name:retailer_data.customerName,
          order_value:order_data.total_amount,
          order_status:rowData.order_status
        }
        list.push(u_data);
      })(visit_details_data[i])
      count++;
      if(count == visit_details_data.length) return res.json({status:true,message:"Data",result:list})
    }
  }else if(visit_status == "Progress"){
    for(let i= 0;i<visit_details_data.length;i++){
      await (async function(rowData){
        let retailer_data = await Retailer.findOne({_id:visit_details_data[i].retailer_id});
        let visit_data = await Visit.findOne({$and:[{retailer_id:visit_details_data[i].retailer_id},{emp_id:employee_id}]});
        let order_data = await Order.findOne({retailer_id:retailer_data._id}).sort({order_date:-1})
        let u_data = {
          retailer_name:retailer_data.customerName,
          last_visit:visit_data.visit_date,
          order_value:order_data.total_amount,
        }
        list.push(u_data);
      })(visit_details_data[i])
      count++;
      if(count == visit_details_data.length) return res.json({status:true,message:"Data",result:list})
    }
  }
})

module.exports = router;