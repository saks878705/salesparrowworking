const express = require("express");
const mongoose = require("mongoose");
const Beat = mongoose.model("Beat");
const Employee = mongoose.model("Employee");
const Location = mongoose.model("Location");
const Route = mongoose.model("Route");
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

router.post("/addBeat", (req, res) => {
  console.log(req.body)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token){
    return res.json({
      status:false,
      message:"Token must be provided"
    })
  }
  var decodedToken = jwt.verify(token, "test");
  var company_id = decodedToken.user_id;
  var beatName = req.body.beatName ? req.body.beatName : "";
  var state = req.body.state ? req.body.state : "";
  var city = req.body.city ? req.body.city : "";
  var employee_id = req.body.employee_id ? req.body.employee_id : "";
  var day = req.body.day ? req.body.day : "";
  var route_id = req.body.route_id ? req.body.route_id : "";
  if(state!=""){
    if(city!=""){
      if (beatName != "") {
        if (employee_id != "") {
          if (day != "") {
            if (route_id != "") {
                  Beat.find({ beatName: beatName })
                    .exec()
                    .then((beat_info) => {
                      if (beat_info.length < 1) {
                        var new_beat = new Beat({
                          beatName: beatName,
                          employee_id: employee_id,
                          day: day,
                          state: state,
                          city: city,
                          company_id:company_id,
                          route_id: route_id,
                          Created_date: get_current_date(),
                          Updated_date: get_current_date(),
                          status: "Active",
                        });
                        new_beat.save().then((data) => {
                          res.status(200).json({
                            status: true,
                            message: "New Beat is created successfully",
                            result: data,
                          });
                        });
                      } else {
                        res.status(401).json({
                          status: true,
                          message: "Beat already exists",
                          result: null,
                        });
                      }
                    });
            } else {
              return res.json({
                status: false,
                message: "Route id is required",
                result: null,
              });
            }
          } else {
            return res.json({
              status: false,
              message: "Day is required",
              result: null,
            });
          }
        } else {
          return res.json({
            status: false,
            message: "Employee id is required",
            result: null,
          });
        }
      } else {
        return res.json({
          status: false,
          message: "Beat Name is required",
          result: null,
        });
      }
    }else{
      return res.json({
        status: false,
        message: "City is required",
        result: null,
      });
    }
  }else{
    return res.json({
      status: false,
      message: "State is required",
      result: null,
    });
  }
    
});

router.post('/editBeat',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    if(id!=""){
        Beat.find({_id:id}).exec().then(beat_data=>{
            if(beat_data.length>0){
                var updated_beat = {};
                if (req.body.beatName) {
                    updated_beat.beatName = req.body.beatName;
                  }
                  if (req.body.employee_id) {
                    updated_beat.employee_id = req.body.employee_id;
                  }
                  if (req.body.day) {
                    updated_beat.day = req.body.day;
                  }
                  if (req.body.route_id) {
                    updated_beat.route_id = req.body.route_id;
                  }
                  if (req.body.status) {
                    updated_beat.status = req.body.status;
                  }
                  updated_beat.Updated_date = get_current_date();
                  Beat.findOneAndUpdate({ _id: id },updated_beat,{ new: true },(err, doc) => {
                      if (doc) {
                        res.status(200).json({
                          status: true,
                          message: "Update successfully",
                          result: updated_beat,
                        });
                      }
                    }
                  );
                } else {
                  res.json({
                    status: false,
                    message: "Beat not found.",
                    result: null,
                  });
                }
              });
    }else{
        return res.json({
            status: false,
            message: "Id is required",
            result: null,
          }); 
    }
});

router.post('/getAllBeat',async (req,res)=>{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token){
    return res.json({
      status:false,
      message:"Token must be provided"
    })
  }
  var page = req.body.page?req.body.page:"1";
  var limit = 5;
  var count =await Beat.find({company_id});
  var list = [];
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    Beat.find({company_id}).sort({Updated_date:-1}).limit( limit * 1).skip((page -1) * limit).sort({Created_date:-1}).exec().then(beat_data=>{
      let counInfo = 0;
      if(beat_data.length>0){
        for(let i = 0;i<beat_data.length;i++){
          Employee.findOne({_id:beat_data[i].employee_id}).exec().then(emp_data=>{
            console.log(beat_data[i].employee_id)
            Route.findOne({_id:beat_data[i].route_id}).exec().then(route_data=>{
              Location.findOne({_id:beat_data[i].state}).exec().then(state_data=>{
                Location.findOne({_id:beat_data[i].city}).exec().then( async (city_data)=>{
                  await (async function (rowData) {
                    var u_data = {
                      id:rowData._id,
                      state:{name:state_data.name,id:beat_data[i].state},
                      city:{name:city_data.name,id:beat_data[i].city},
                      employee_name:emp_data.employeeName,
                      route_name:{start_point:route_data.start_point,end_point:route_data.end_point},
                      beatName:rowData.beatName,
                      day:rowData.day,
                      status:rowData.status
                    };
                    list.push(u_data);
                  })(beat_data[i]);
                  counInfo++;
                  if(counInfo==beat_data.length){
                    let c = Math.ceil(count.length/limit);
                    if(c==0){
                       c+=1;
                    }
                    res.json({
                      status:true,
                      message:"All Beats found successfully",
                      result:list,
                      pageLength:c
                  })
                  }
                })
              })
            })
          })
        }
      }else{
        return res.json({
          status: true,
          message: "Beat not found",
          result: [],
        });
      }
    })
});

router.post('/getBeat',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    Beat.findOne({_id:id}).exec().then(beat_data=>{
      if(beat_data){
        Location.findOne({_id:beat_data.state}).exec().then(state_data=>{
          Location.findOne({_id:beat_data.city}).exec().then(city_data=>{
            Employee.findOne({_id:beat_data.employee_id}).exec().then(emp_data=>{
              Route.findOne({_id:beat_data.route_id}).exec().then(route_data=>{
                var u_data = {
                  id:beat_data._id,
                  state:{name:state_data.name,id:beat_data.state},
                  city:{name:city_data.name,id:beat_data.city},
                  employee_name:emp_data.employeeName,
                  route_name:{start_point:route_data.start_point,end_point:route_data.end_point},
                  day:beat_data.day,
                  beatName:beat_data.beatName
                }
                res.json({
                  status:true,
                  message:"data fetched",
                  result:[u_data]
                })
              })
            })
          })
        })
      }else{
        res.json({
          status:false,
          message:"Beat not found",
          result:[]
      })
      }
    })
});

router.delete("/deleteBeat", (req,res) => {
    var id = req.body.id ?req.body.id: "";
    if (id != "") {
      Beat.findOneAndDelete({_id:id}).exec().then((doc) => {
        res.status(200).json({
          status: true,
          message: "Deleted successfully",
        });
        });
    }
  });
module.exports = router;
