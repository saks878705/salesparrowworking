const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Attendance = mongoose.model("Attendance");
const router = express.Router();
const base_url = "http://salesparrow.herokuapp.com/";
const multer = require("multer");
const sid = "ACc3f03d291aaa9b78b8088eb0b77bf616";
const auth_token = "b088eeb84d39bd2cc2679faea930b620";
const twilio = require("twilio")(sid, auth_token);
const jwt = require("jsonwebtoken");

const imageStorage = multer.diskStorage({
  destination: "images/Employee_image",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now());
  },
});

const imageUpload = multer({
  storage: imageStorage,
});

function get_current_date() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (today = yyyy + "-" + mm + "-" + dd + " " + time);
}

router.post('/punchAttendance',imageUpload.fields([{name:"selfie"}]),(req,res)=>{
    console.log(req.body);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        status: false,
        message: "Token must be provided",
      });
    }
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    var beat = req.body.beat?req.body.beat:"";
    var distributor = req.body.distributor?req.body.distributor:"";
    var activity = req.body.activity?req.body.activity:"";
    var location = req.body.location?req.body.location:"";
    if(beat!=""){
        if(distributor!=""){
            if(activity!=""){
                if(location!=""){
                    Employee.findOne({_id:employee_id}).exec().then(emp_data=>{
                        if(emp_data.status=="Active" || emp_data.status=="Approved"){
                            var new_attendance = new Attendance({
                                emp_id:employee_id,
                                distributor_id:distributor,
                                beat_id:beat,
                                activity:activity,
                                selfie:base_url+req.files.selfie[0].path,
                                location:location,
                                check_in:get_current_date(),
                                Created_date:get_current_date(),
                                Updated_date:get_current_date(),
                                status:"Working",
                            });
                            new_attendance.save().then(data=>{
                                res.json({
                                    status:true,
                                    message:"Attendance marked successfully",
                                    result:data
                                })
                            })
                        }else{
                            res.json({
                                status:false,
                                message:"You are not active yet",
                            })
                        }
                    })
                }else{
                    res.json({
                        status:false,
                        message:"Location must be selected",
                    })
                }
            }else{
                res.json({
                    status:false,
                    message:"Activity must be selected",
                })
            }
        }else{
            res.json({
                status:false,
                message:"Distributor must be selected",
            })
        }
    }else{
        res.json({
            status:false,
            message:"Beat must be selected",
        })
    }

});

module.exports = router;