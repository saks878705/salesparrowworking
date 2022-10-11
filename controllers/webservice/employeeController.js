const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const router = express.Router();
const base_url = "http://salesparrow.herokuapp.com/";
const multer = require("multer");
const sid = "ACc3f03d291aaa9b78b8088eb0b77bf616";
const auth_token = "b088eeb84d39bd2cc2679faea930b620";
const twilio = require("twilio")(sid,auth_token);
const jwt          = require('jsonwebtoken');

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
  };

  router.post("/addEmployee",imageUpload.fields([{name:"Employee_image"}]), (req, res) => {
    console.log(req.body);
    var employeeName = req.body.employeeName ? req.body.employeeName : "";
    var phone = req.body.phone ? req.body.phone : "";
    var email = req.body.email ? req.body.email : "";
    var address = req.body.address ? req.body.address : "";
    var state = req.body.state ? req.body.state : "";
    var city = req.body.city ? req.body.city : "";
    var pincode = req.body.pincode ? req.body.pincode : "";
    var district = req.body.district ? req.body.district : "";
    var experience = req.body.experience ? req.body.experience : "";
    var qualification = req.body.qualifications ? req.body.qualifications : "";
    if (employeeName != "") {
      if (phone != "") {
        if (email != "") {
            if (address != "") {
              Employee.find({ email: email })
                .exec()
                .then((email_info) => {
                  if (email_info.length < 1) {
                    var new_employee = new Employee({
                        employeeName: employeeName,
                        phone: phone,
                        email: email,
                        address: address,
                        city: city,
                        image:base_url + req.files.Employee_image[0].path,
                        state: state,
                        district: district,
                        pincode: pincode,
                        qualification: qualification,
                        experience: experience,
                        Created_date: get_current_date(),
                        Updated_date: get_current_date(),
                        status: "Active",
                      });
                      new_employee.save().then((data) => {
                        res.status(200).json({
                          status: true,
                          message: "New subAdmin is created successfully",
                          results: data,
                        });
                      });
                  } else {
                    res.status(200).json({
                      status: false,
                      message: "Email already exists",
                      result: null,
                    });
                  }
                });
            } else {
              return res.json({
                status: false,
                message: "Address is required",
                results: null,
              });
            }
          } else {
            return res.json({
              status: false,
              message: "Email is required",
              results: null,
            });
          }
      } else {
        return res.json({
          status: false,
          message: "Phone is required",
          results: null,
        });
      }
    } else {
      return res.json({
        status: false,
        message: "EmployeeName is required",
        results: null,
      });
    }
  });

router.patch('/editEmployee',(req,res)=>{
    var id = req.body.id ? req.body.id : "";
    if (id != "") {
      Employee.find({ _id: id }).exec().then(async (employee_info) => {
        if (employee_info.length> 0) {
            var updated_employee = {};
            if (req.body.name) {
              updated_employee.employeeName = req.body.name;
            }
            if (req.body.phone) {
              updated_employee.phone = req.body.phone;
            }
            if (req.body.email) {
              updated_employee.email = req.body.email;
            }
            if (req.body.address) {
              updated_employee.address = req.body.address;
            }
            if (req.body.city) {
              updated_employee.city = req.body.city;
            }
            if (req.body.state) {
              updated_employee.state = req.body.state;
            }
            if (req.body.pincode) {
              updated_employee.pincode = req.body.pincode;
            }
            if (req.body.district) {
              updated_employee.district = req.body.district;
            }
            if (req.body.experience) {
              updated_employee.experience = req.body.experience;
            }
            if (req.body.qualification) {
              updated_employee.qualification = req.body.qualification;
            }
            updated_employee.Updated_date = get_current_date();
            Employee.findOneAndUpdate({ _id: id },updated_employee,{ new: true },(err, doc) => {
                if (doc) {
                  res.status(200).json({
                    status: true,
                    message: "Update successfully",
                    results: updated_employee,
                  });
                }
              }
            );
          } else {
            res.json({
              status: false,
              message: "Employee not found.",
              result: null,
            });
          }
        });
    } else {
      return res.json({
        status: false,
        message: "ID is required",
        result: null,
      });
    }
});

router.get('/getAllEmployee',(req,res)=>{
    Employee.find().exec().then(employee_data=>{
        res.json({
            status:true,
            message:"All Employees found successfully",
            result:employee_data
        })
    })
});

router.get('/getEmployee',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    Employee.find({_id:id}).exec().then(employee_data=>{
        res.json({
            status:true,
            message:"Employee found successfully",
            result:employee_data
        })
    })
});

router.delete('/deleteEmployee',(req,res)=>{
  var id = req.body.id?req.body.id:"";
  Employee.deleteOne({_id:id}).exec().then(employee_data=>{
    res.json({
        status:true,
        message:"Employee deleted successfully",
    })
})
});

router.post('/sendOtp',(req,res)=>{
  var to_phone_number = req.body.to_phone_number?req.body.to_phone_number:"";
  if(to_phone_number!=""){
    Employee.findOne({phone:to_phone_number}).exec().then(data=>{
      var OTP = Math.floor(1000 + Math.random() * 9000);
      const token = jwt.sign({ user_id: data._id, is_token_valide: 1 },"test");
      if(data){
        twilio.messages.create({
          from:"+18505186447",
          to:to_phone_number,
          body:OTP,
      }).then(()=>{
          res.json({
              status:true,
              message:"Message has been sent",
              token:token
          })
      }).catch((err)=>{
          console.log(err);
          res.json({
              status:false,
              message:"There is some error."
          })
      })
      }else{
        res.json({
          status:false,
          message:"Not registered yet.please contact your admin."
      })
      }
    })
}else{
    res.json({
        status:false,
        message:"Phone number is required"
    })
}
});

module.exports = router;