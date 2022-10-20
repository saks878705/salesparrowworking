const express = require("express");
const mongoose = require("mongoose");
const Beat = mongoose.model("Beat");
const Employee = mongoose.model("Employee");
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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  var decodedToken = jwt.verify(token, "test");
  var company_id = decodedToken.user_id;
  var beatName = req.body.beatName ? req.body.beatName : "";
  var employee_id = req.body.employee_id ? req.body.employee_id : "";
  var day = req.body.day ? req.body.day : "";
  var route_id = req.body.route_id ? req.body.route_id : "";
  if(token!=""){
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
                          results: data,
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
              results: null,
            });
          }
        } else {
          return res.json({
            status: false,
            message: "Day is required",
            results: null,
          });
        }
      } else {
        return res.json({
          status: false,
          message: "Employee id is required",
          results: null,
        });
      }
    } else {
      return res.json({
        status: false,
        message: "Beat Name is required",
        results: null,
      });
    }
  }else{
    return res.json({
      status: false,
      message: "Token is required",
      results: null,
    });
  }
});

router.patch('/editBeat',(req,res)=>{
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
                          results: updated_beat,
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
            results: null,
          }); 
    }
});

router.post('/getAllBeat',async (req,res)=>{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  var decodedToken = jwt.verify(token, "test");
  var company_id = decodedToken.user_id;
  var page = req.body.page?req.body.page:"1";
  var limit = 5;
  var count =await Beat.find({company_id});
  var list = [];
    Beat.find({company_id}).limit( limit * 1).skip((page -1) * limit).exec().then(beat_data=>{
      let counInfo = 0;
      if(beat_data.length>0){
        for(let i = 0;i<beat_data.length;i++){
          Employee.findOne({_id:beat_data[i].employee_id}).exec().then(emp_data=>{
            Route.findOne({_id:beat_data[i].route_id}).exec().then(route_data=>{
                await (async function (rowData) {
                  var u_data = {
                    id:rowData._id,
                    employee_name:emp_data._id,
                    route:route_data._id,
                    beatName:rowData.beatName,
                    day:rowData.day,
                  };
                  list.push(u_data);
                })(beat_data[i]);
                counInfo++;
                if(counInfo==beat_data.length){
                  res.json({
                    status:true,
                    message:"All Beats found successfully",
                    result:list,
                    pageLength:Math.ceil(count.length/limit)
                })
                }
            })
          })
        }
      }else{
        return res.json({
          status: false,
          message: "Beat not found",
          results: [],
        });
      }
    })
});

// router.get('/getBeat',(req,res)=>{
//     var id = req.body.id?req.body.id:"";
//     Beat.find({_id:id}).exec().then(beat_data=>{
//         res.json({
//             status:true,
//             message:"Beat found successfully",
//             result:beat_data
//         })
//     })
// });

router.delete("/deleteBeat", (req, res) => {
    var id = req.query.id ?? "";
    if (id != "") {
      Beat.deleteOne({ _id: id })
        .exec()
        .then(() => {
          res.status(200).json({
            status: true,
            message: "Deleted successfully",
            result: null,
          });
        });
    }
  });
module.exports = router;
