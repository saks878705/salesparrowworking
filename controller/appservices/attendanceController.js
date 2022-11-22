const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Attendance = mongoose.model("Attendance");
const Beat = mongoose.model("Beat");
const Party = mongoose.model("Party");
const router = express.Router();
const base_url = "https://salesparrow.teknikoglobal.com/";
const multer = require("multer");
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
    if (!token) return res.json({status: false,message: "Token must be provided",});
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    var beat = req.body.beat?req.body.beat:"";
    var party = req.body.party?req.body.party:"";
    var activity = req.body.activity?req.body.activity:"";
    var location = req.body.location?req.body.location:"";
    if(beat!=""){
        if(party!=""){
            if(activity!=""){
                if(location!=""){
                    Employee.findOne({_id:employee_id}).exec().then(emp_data=>{
                        if(emp_data.status=="Active" || emp_data.status=="Approved"){
                            var new_attendance = new Attendance({
                                emp_id:employee_id,
                                party_id:party,
                                beat_id:beat,
                                activity_id:activity,
                                selfie:base_url+req.files.selfie[0].path,
                                location:location,
                                Created_date:get_current_date(),
                                Updated_date:get_current_date(),
                                status:"Working",
                            });
                            new_attendance.save().then(async (data)=>{
                                if(data){
                                    let beat_data = await Beat.findOne({_id:data.beat_id});
                                    return res.json({
                                        status:true,
                                        message:"Attendance marked successfully",
                                        result:beat_data
                                    })
                                }
                            })
                        }else{
                            return res.json({status:false,message:"You are not active yet",})
                        }
                    })
                }else{
                    return res.json({status:false,message:"Location must be selected",})
                }
            }else{
                return res.json({status:false,message:"Activity must be selected",})
            }
        }else{
            return res.json({status:false,message:"Distributor must be selected",})
        }
    }else{
        return res.json({status:false,message:"Beat must be selected",})
    }

});

router.post('/attendanceListOfEmployee',async(req,res)=>{
    let employee_id = req.body.employee_id?req.body.employee_id:"";
    let page = req.body.page?req.body.page:"1";
    if(employee_id=="") return res.json({status:false,message:"Please provide the Employee"});
    let count = await Attendance.find({emp_id:employee_id});
    let limit = 10;
    let attendance_data =await Attendance.find({emp_id:employee_id}).limit(limit*1).skip((page-1)*limit);
    if(attendance_data.length<1) return res.json({status:true,message:"No Data",result:[]});
    let counInfo = 0
    for(let i = 0;i<attendance_data.length;i++){
        let list = [];
        await (async function (rowData) {
            var beat_data = await Beat.findOne({_id: attendance_data[i].beat_id,});
            var party_data = await Party.findOne({_id: attendance_data[i].party_id,});
            var employee_data = await Employee.findOne({_id: attendance_data[i].emp_id,});
            var u_data = {
                id: rowData._id,
                party: { name: party_data.firmName, id: party_data._id },
                beat: { name: beat_data.beatName, id: beat_data._id },
                employee:{name:employee_data.employeeName,id:employee_data._id},
                activity:rowData.activity,
                selfie:rowData.selfie,
                location:rowData.location,
                status:rowData.status
            };
            list.push(u_data);
          })(attendance_data[i]);
          counInfo++;
          if (counInfo == attendance_data.length) {
            let c = Math.ceil(count.length / limit);
            console.log(count.length);
            console.log(c);
            if (c == 0) {
              c += 1;
            }
            res.json({
              status: true,
              message: "Parties for this state found successfully",
              result: list,
              pageLength: c,
            });
          }
    }
})

module.exports = router;