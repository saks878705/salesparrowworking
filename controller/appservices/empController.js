const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Location = mongoose.model("Location");
const Role = mongoose.model("role");
const Party = mongoose.model("Party");
const Admin = mongoose.model("AdminInfo");
const Beat = mongoose.model("Beat");
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

  router.post("/addEmployee",imageUpload.fields([{ name: "Employee_image" }]),(req, res) => {
    console.log(req.body);
    var employeeName = req.body.employeeName ? req.body.employeeName : "";
    var companyShortCode = req.body.companyShortCode ? req.body.companyShortCode : "";
    var phone = req.body.phone ? req.body.phone : "";
    var state = req.body.state ? req.body.state : "";
    var city = req.body.city ? req.body.city : "";
    var pincode = req.body.pincode ? req.body.pincode : "";
    var district = req.body.district ? req.body.district : "";
    if (employeeName != "") {
      if (phone != "") {
          if (companyShortCode != "") {
            Admin.findOne({companyShortCode}).exec().then((admin_info) => {
                if (admin_info.length > 0) {
                  var new_employee = new Employee({
                    employeeName: employeeName,
                    phone: phone,
                    city: city,
                    companyId: admin_info._id,
                    image: base_url + req.files.Employee_image[0].path,
                    state: state,
                    district: district,
                    pincode: pincode,
                    Created_date: get_current_date(),
                    Updated_date: get_current_date(),
                    status: "UnApproved",
                  });
                  new_employee.save().then((data) => {
                    res.status(200).json({
                      status: true,
                      message: "New Employee is created successfully",
                      results: data,
                    });
                  });
                } else {
                  res.json({
                    status: false,
                    message: "Company short code is wrong",
                    result: null,
                  });
                }
              });
          } else {
            return res.json({
              status: false,
              message: "companyShortCode is required",
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
  }
);

  router.post("/sendOtp", (req, res) => {
    console.log(req.body)
    var to_phone_number = req.body.to_phone_number? req.body.to_phone_number: "";
    if (to_phone_number != "") {
      Employee.findOne({ phone: to_phone_number })
        .exec()
        .then((data) => {
          //var OTP = Math.floor(1000 + Math.random() * 9000);
          var OTP = "1234"
          // const token = jwt.sign(
          //   { user_id: data._id, is_token_valide: 1 },
          //   "test"
          // );
          if (data) {
            twilio.messages
              .create({
                from: "+18505186447",
                to: to_phone_number,
                body: OTP,
              })
              .then(() => {
                Employee.findOneAndUpdate({phone: to_phone_number},{$set:{otp:OTP}}).exec().then(()=>{
                  res.json({
                    status: true,
                    message: "Message has been sent",
                    //token: token,
                  });
                })
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  status: false,
                  message: "There is some error.",
                });
              });
          } else {
            res.json({
              status: false,
              message: "Not registered yet.please contact your admin.",
            });
          }
        });
    } else {
      res.json({
        status: false,
        message: "Phone number is required",
      });
    }
  });
  
  router.post('/emplogin',(req,res)=>{
    console.log(req.body);
    var otp = (req.body.otp) ? req.body.otp : "";
    if(otp!=""){
        Employee.findOne({otp:otp}).exec().then(emp_data=>{
          if(emp_data){
                const token = jwt.sign({ user_id: emp_data._id, is_token_valide: 1 },"test");
                res.json({
                  status:true,
                  message:"Login Successful",
                  result:emp_data,
                  token:token
              })
          }else{
            res.json({
              status:false,
              message:"Employee not found"
            })
          }
  
        })
    }else{
      res.json({
        status:false,
        message:"OTP is required"
      })
    }
  })
  

  router.get('/getEmployee',(req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
      res.json({
        status:false,
        message:"Token is required"
      })
    }
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
      Employee.findOne({_id:employee_id}).exec().then(employee_data=>{
        if(employee_data.status=="Approved"){
            Location.findOne({ _id: employee_data.state }).exec().then((state_data) => {
                Location.findOne({ _id: employee_data.city }).exec().then((city_data) => {
                    Location.findOne({ _id: employee_data.district }).exec().then(async (area_data) => {
                      Role.findOne({_id:employee_data.roleId}).exec().then(role_data=>{
                        var u_data = {
                          employeeName:employee_data.employeeName,
                          roleId:{name:role_data.rolename,id:role_data._id},
                          companyId:employee_data.companyId,
                          manager:employee_data.manager,
                          phone:employee_data.phone,
                          email:employee_data.email,
                          address:employee_data.address,
                          pincode:employee_data.pincode,
                          state:state_data.name,
                          image:employee_data.image,
                          city:city_data.name,
                          district:area_data.name,
                          experience:employee_data.experience,
                          qualification:employee_data.qualification,
                          userExpenses:employee_data.userExperience,
                          transportWays:employee_data.transportWays,
                          status:employee_data.status,
                        }
                        res.json({
                          status:true,
                          message:"Employee found successfully",
                          result:u_data
                      })
                      })
                    })
                  })
                })
        }else{
            res.json({
                status:true,
                message:"Your profile is not approved yet",
                result:[]
            })
        }
        
      })
  });

  router.post('/profile_update',(req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
      res.json({
        status:false,
        message:"Token is required"
      })
    }
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    Employee.findOne({_id:employee_id}).exec().then(emp_data=>{
      if(emp_data.status=="Active"){
        var updated_emp = {}
        if(req.body.phone){
          updated_emp.phone = req.body.phone;
        }
        if(req.body.email){
          updated_emp.email = req.body.email;
        }
        if(req.body.qualification){
          updated_emp.qualification = req.body.qualification;
        }
        if(req.body.experience){
          updated_emp.experience = req.body.experience;
        }
        if(req.body.address){
          updated_emp.address = req.body.address;
        }
        if(req.body.state){
          updated_emp.state = req.body.state;
        }
        if(req.body.city){
          updated_emp.city = req.body.city;
        }
        if(req.body.district){
          updated_emp.district = req.body.district;
        }
        if(req.body.pincode){
          updated_emp.pincode = req.body.pincode;
        }
        if(req.body.image){
          updated_emp.image = req.body.image;
        }
        Employee.findOneAndUpdate({_id:user_id},updated_emp,{new:true},(err,doc)=>{
          if(doc){
            res.json({
              status:true,
              message:"Updated successfully",
              result:updated_emp
            })
          }
        })
      }else{
        res.json({
          status:false,
          message:"You are inactive."
        })
      }
    })
  })
  
  router.post('/addPartyEmp',(req,res)=>{
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
  var employee_id = decodedToken.user_id;
    var partyType = req.body.partyType?req.body.partyType:"";
    var firmName = req.body.firmName?req.body.firmName:"";
    var GSTNo = req.body.GSTNo?req.body.GSTNo:"";
    var contactPersonName = req.body.contactPersonName?req.body.contactPersonName:"";
    var mobileNo = req.body.mobileNo?req.body.mobileNo:"";
    var email = req.body.email?req.body.email:"";
    var pincode = req.body.pincode?req.body.pincode:"";
    var state = req.body.state?req.body.state:"";
    var city = req.body.city?req.body.city:"";
    var district = req.body.district?req.body.district:"";
    var address = req.body.address?req.body.address:"";
    var DOB = req.body.DOB?req.body.DOB:"";
    var DOA = req.body.DOA?req.body.DOA:"";
    var route = req.body.route?req.body.route:"";
    if(partyType!=""){
        if(firmName!=""){
            if(mobileNo!=""){
                if(pincode!=""){
                    if(city!=""){
                        if(state!=""){
                            if(district!=""){
                                if(address!=""){
                                  Employee.findOne({_id:employee_id}).exec().then(emp_data=>{
                                    console.log("employee",emp_data)
                                    var new_party = new Party({
                                      partyType:partyType,
                                      firmName:firmName,
                                      GSTNo:GSTNo,
                                      contactPersonName:contactPersonName,
                                      mobileNo:mobileNo,
                                      email:email,
                                      company_id:emp_data.companyId,
                                      employee_id:emp_data._id,
                                      pincode:pincode,
                                      state:state,
                                      route:route,
                                      city:city,
                                      district:district,
                                      address:address,
                                      DOB:DOB,
                                      DOA:DOA,
                                      Created_date:get_current_date(),
                                      Updated_date:get_current_date(),
                                      status:"Active"
                                  })
                                  new_party.save().then(data=>{
                                      res.status(200).json({
                                          status:true,
                                          message:"Party created successfully",
                                          result:data
                                      });
                                  })
                                  })
                                }else{
                                    res.json({
                                        status:false,
                                        message:"address is required"
                                    });
                                }
                            }else{
                                res.json({
                                    status:false,
                                    message:"district is required"
                                });
                            }
                        }else{
                            res.json({
                                status:false,
                                message:"state is required"
                            });
                        }
                    }else{
                        res.json({
                            status:false,
                            message:"City is required"
                        });
                    }
                }else{
                    res.json({
                        status:false,
                        message:"pincode is required"
                    });
                }
            }else{
                res.json({
                    status:false,
                    message:"Mobile Number is required"
                });
            }
        }else{
            res.json({
                status:false,
                message:"Firm Name is required"
            });
        }
    }else{
        res.json({
            status:false,
            message:"partyType is required"
        });
    }
  
  });
  
  router.post('/getAllPartyEmp',async (req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
      return res.json({
        status:false,
        message:"Token must be provided"
      })
    }
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    var page = req.body.page?req.body.page:"1";
    var limit = 5;
    var count =await Party.find({employee_id});
    var list = [];
    Party.find({employee_id}).limit(limit*1).skip((page - 1) * limit).exec().then(party_data=>{
      if(party_data.length>0){
          let counInfo = 0;
          for(let i=0;i<party_data.length;i++){
              Location.findOne({_id:party_data[i].state}).exec().then(state_data=>{
                  Location.findOne({_id:party_data[i].city}).exec().then(city_data=>{
                      Location.findOne({_id:party_data[i].district}).exec().then(async (district_data)=>{
                          await (async function (rowData) {
                              var u_data = {
                                  id:rowData._id,
                                  state:{name:state_data.name,id:rowData.state},
                                  city:{name:city_data.name,id:rowData.city},
                                  district:{name:district_data.name,id:rowData.district},
                                  firmName:rowData.firmName,
                                  address:rowData.address,
                                  partyType:rowData.partyType,
                                  image:rowData.image,
                                  pincode:rowData.pincode,
                                  GSTNo:rowData.GSTNo,
                                  contactPersonName:rowData.contactPersonName,
                                  mobileNo:rowData.mobileNo,
                                  email:rowData.email,
                                  DOB:rowData.DOB,
                                  DOA:rowData.DOA,
                                  route:rowData.route,
                                status:rowData.status
                              };
                              list.push(u_data);
                            })(party_data[i]);
                            counInfo++;
                            if(counInfo==party_data.length){
                              let c = Math.ceil(count.length/limit);
                              if(c==0){
                                 c+=1;
                              }
                              res.json({
                                status:true,
                                message:"All Parties found successfully",
                                result:list,
                                pageLength:c
                            })
                            }
                      })
                  })
              })
          }
      }else{
          res.json({
              status:true,
              message:"No party found",
              result:[]
          })
      }
    })
  })

module.exports = router;