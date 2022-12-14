const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Location = mongoose.model("Location");
const PartyType = mongoose.model("PartyType");
const Party = mongoose.model("Party");
const Admin = mongoose.model("AdminInfo");
const Beat = mongoose.model("Beat");
const Route = mongoose.model("Route");
const router = express.Router();
const base_url = "https://salesparrow.teknikoglobal.com/";
const multer = require("multer");
const sid = "ACc3f03d291aaa9b78b8088eb0b77bf616";
const auth_token = "dcd61bc9945d61c11b67612fdef40534";
const twilio = require("twilio")(sid, auth_token);
const jwt = require("jsonwebtoken");
const axios = require("axios")

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

router.post( "/addEmployee", imageUpload.fields([{ name: "Employee_image" }]), (req, res) => {
    console.log(req.body);
    var employeeName = req.body.employeeName ? req.body.employeeName : "";
    var companyShortCode = req.body.companyShortCode? req.body.companyShortCode: "";
    var phone = req.body.phone ? req.body.phone : "";
    var state = req.body.state ? req.body.state : "";
    var email = req.body.email ? req.body.email : "";
    var headquarterState = req.body.headquarterState? req.body.headquarterState: "";
    var headquarterCity = req.body.headquarterCity? req.body.headquarterCity: "";
    var city = req.body.city ? req.body.city : "";
    var pincode = req.body.pincode ? req.body.pincode : "";
    // var district = req.body.district ? req.body.district : "";
    if (employeeName != "") {
      if (phone != "") {
        if (companyShortCode != "") {
          Admin.findOne({ companyShortCode }).exec().then(async (admin_info) => {
            if (admin_info) {
              console.log(admin_info);
              let company = await Admin.findOne({companyShortCode});
              console.log(company)
              var emp_data = await Employee.findOne({companyId:company._id}).sort({employee_code:-1});
              if(emp_data){
                var employee_code = emp_data.employee_code + 1;
              }else{
                var employee_code = 1;
              }
                var employee_data = await Employee.find({$and:[{companyId:company._id},{phone}]});
                if(employee_data.length>0){
                  return res.json({status:false,message:"Phone number already exists"})
                }
                var new_employee = new Employee({
                  employeeName: employeeName,
                  phone: phone,
                  city: city,
                  company_code:admin_info.companyShortCode+"E",
                  employee_code:employee_code,
                  email:email,
                  headquarterState: headquarterState,
                  headquarterCity: headquarterCity,
                  companyId: admin_info._id,
                  image: base_url + req.files.Employee_image[0].path,
                  state: state,
                  // district: district,
                  pincode: pincode,
                  Created_date: get_current_date(),
                  Updated_date: get_current_date(),
                  status: "UnApproved",
                });
                new_employee.save().then((data) => {
                  return res.status(200).json({
                    status: true,
                    message: "New Employee is created successfully",
                    results: data,
                  });
                });
              } else {
                return res.json({
                  status: false,
                  message: "Company short code is wrong",
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

// router.post("/sendOtp", (req, res) => {
//   console.log(req.body);
//   var to_phone_number = req.body.to_phone_number
//     ? req.body.to_phone_number
//     : "";
//   if (to_phone_number != "") {
//     Employee.findOne({ phone: to_phone_number }).exec().then((data) => {
//       if(data){
//         if (data.status == "InActive" || data.status == "UnApproved") {
//           return res.json({
//             status: false,
//             message: `You are ${data.status}. Please contact company.`,
//           });
//         }
//         //var OTP = Math.floor(1000 + Math.random() * 9000);
//         var OTP = "1234";
//         // const token = jwt.sign(
//         //   { user_id: data._id, is_token_valide: 1 },
//         //   "test"
//         // );
//         if (data.status=="Active" || data.status=="Approved") {
//               Employee.findOneAndUpdate(
//                 { phone: to_phone_number },
//                 { $set: { otp: OTP } }
//               ).exec().then(() => {
//                   res.json({
//                     status: true,
//                     message: "Message has been sent",
//                   });
//                 });
          
//             // .catch((err) => {
//             //   console.log(`err--------${err.message}-------thats all`);
//             //   if(err.message.includes("unverified")){
//             //     console.log("inside if")
//             //     Employee.findOneAndUpdate(
//             //       { phone: to_phone_number },
//             //       { $set: { otp: OTP } }
//             //     )
//             //       .exec()
//             //       .then(() => {
//             //        return res.json({
//             //           status: true,
//             //           message: "Message has been sent",
//             //         });
//             //       });
//             //   }else{
//             //     console.log("inside else")
//             //     res.json({
//             //       status: false,
//             //       message: "There is some error.",
//             //     });
//             //   }
//             //   });
              
//         } else {
//           res.json({
//             status: false,
//             message: "Not registered yet.please contact your admin.",
//           });
//         }
//       }else{
//         res.json({
//           status: true,
//           message: "Employee not found",
//         });
//       }
//       });
//   } else {
//     res.json({
//       status: false,
//       message: "Phone number is required",
//     });
//   }
// });

router.post('/sendOtp',async(req,res)=>{
  var to_phone_number = req.body.to_phone_number? req.body.to_phone_number: "";
  // let otp = Math.floor(1000 + Math.random() * 9000);
  let otp = '1234';
  Employee.findOne({phone:to_phone_number}).exec().then(emp_data=>{
    if(!emp_data) return res.json({status:true,message:"Employee not found",type:"Register"});
    Employee.findOneAndUpdate({phone:to_phone_number},{$set:{otp:otp}},{new:true},async()=>{
    let res1 =await axios.get(`https://2factor.in/API/V1/f77ba5e8-641e-11ed-9c12-0200cd936042/SMS/${to_phone_number}/${otp}`)
    console.log(res1.data.Status);
    if(res1.data.Status=="Success"){
      return res.json({status:true,message:res1.data.Status,type:"Login",})
    }
  })
  });
})

router.post("/emplogin", (req, res) => {
  console.log(req.body);
  var phone = req.body.phone ? req.body.phone : "";
  var otp = req.body.otp ? req.body.otp : "";
  if(otp=="") return res.json({status:false,message:"Otp is required"})
  if (phone != "") {
    Employee.findOne({$and:[{otp},{ phone }]}).exec().then((emp_data) => {
        if (emp_data) {
          if (emp_data.status == "InActive" ||emp_data.status == "UnApproved") {
            return res.json({
              status: false,
              message: `You are ${emp_data.status}. Please contact company.`,
            });
          }
          const token = jwt.sign(
            { user_id: emp_data._id, is_token_valide: 1 },
            "test"
          );
          res.json({
            status: true,
            message: "Login Successful",
            result: emp_data,
            token: token,
          });
        } else {
          res.json({
            status: false,
            message: "Employee not found",
          });
        }
      });
  } else {
    res.json({
      status: false,
      message: "OTP is required",
    });
  }
});

router.get("/getEmployee", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.json({
      status: false,
      message: "Token is required",
    });
  }
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  Employee.findOne({ _id: employee_id })
    .exec()
    .then((employee_data) => {
      if (
        employee_data.status == "Approved" ||
        employee_data.status == "Active"
      ) {
        Location.findOne({ _id: employee_data.state })
          .exec()
          .then((state_data) => {
            Location.findOne({ _id: employee_data.city })
              .exec()
              .then((city_data) => {
                // Location.findOne({ _id: employee_data.district })
                //   .exec()
                //   .then(async (area_data) => {
                    Location.findOne({ _id: employee_data.headquarterState })
                      .exec()
                      .then(async (headquarter_state_data) => {
                        Location.findOne({ _id: employee_data.headquarterCity })
                          .exec()
                          .then(async (headquarter_city_data) => {
                            var u_data = {
                              employeeName: employee_data.employeeName,
                              companyId: employee_data.companyId,
                              phone: employee_data.phone,
                              email: employee_data.email,
                              address: employee_data.address,
                              employee_unique_id:`${employee_data.company_code}${employee_data.employee_code}`,
                              headquarterState:
                                headquarter_state_data.headquarterState,
                              headquarterCity:
                                headquarter_city_data.headquarterCity,
                              pincode: employee_data.pincode,
                              state: state_data.name,
                              image: employee_data.image,
                              city: city_data.name,
                              // district: area_data.name,
                              experience: employee_data.experience,
                              qualification: employee_data.qualification,
                              userExpenses: employee_data.userExperience,
                              transportWays: employee_data.transportWays,
                              status: employee_data.status,
                            };
                            res.json({
                              status: true,
                              message: "Employee found successfully",
                              result: u_data,
                            });
                          });
                      });
                  // });
              });
          });
      } else {
        res.json({
          status: true,
          message: "Your profile is not approved yet",
          result: [],
        });
      }
    });
});

router.post("/profile_update", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.json({
      status: false,
      message: "Token is required",
    });
  }
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  Employee.findOne({ _id: employee_id })
    .exec()
    .then((emp_data) => {
      if (emp_data.status == "Active" || emp_data.status == "Approved") {
        var updated_emp = {};
        if (req.body.phone) {
          updated_emp.phone = req.body.phone;
        }
        if (req.body.email) {
          updated_emp.email = req.body.email;
        }
        if (req.body.qualification) {
          updated_emp.qualification = req.body.qualification;
        }
        if (req.body.experience) {
          updated_emp.experience = req.body.experience;
        }
        if (req.body.address) {
          updated_emp.address = req.body.address;
        }
        if (req.body.state) {
          updated_emp.state = req.body.state;
        }
        if (req.body.city) {
          updated_emp.city = req.body.city;
        }
        // if (req.body.district) {
        //   updated_emp.district = req.body.district;
        // }
        if (req.body.pincode) {
          updated_emp.pincode = req.body.pincode;
        }
        if (req.body.image) {
          updated_emp.image = req.body.image;
        }
        Employee.findOneAndUpdate(
          { _id: employee_id },
          updated_emp,
          { new: true },
          (err, doc) => {
            if (doc) {
              res.json({
                status: true,
                message: "Updated successfully",
                result: updated_emp,
              });
            }
          }
        );
      } else {
        res.json({
          status: false,
          message: "You are inactive.",
        });
      }
    });
});

router.post(
  "/employeeProfileImage",
  imageUpload.fields([{ name: "Employee_image" }]),
  (req, res) => {
    console.log(req.body);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.json({
        status: false,
        message: "Token is required",
      });
    }
    let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    Employee.findOne({ _id: employee_id })
      .exec()
      .then((user_data) => {
        if (user_data) {
          updated_employee = {};
          if (req.files.Employee_image) {
            updated_employee.image =
              base_url + req.files.Employee_image[0].path;
          }
          Employee.findOneAndUpdate(
            { _id: employee_id },
            updated_employee,
            { new: true },
            (err, doc) => {
              if (doc) {
                res.status(200).json({
                  status: true,
                  message: "Updated Successfully",
                  result: updated_employee,
                });
              } else {
                res.json({
                  status: false,
                  message: "Error",
                  result: err,
                });
              }
            }
          );
        } else {
          res.json({
            status: false,
            message: "Id must be correct.",
          });
        }
      });
  }
);

router.post("/addPartyEmp", (req, res) => {
  console.log(req.body);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      status: false,
      message: "Token must be provided",
    });
  }
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  var partyType = req.body.partyType ? req.body.partyType : "";
  var firmName = req.body.firmName ? req.body.firmName : "";
  var GSTNo = req.body.GSTNo ? req.body.GSTNo : "";
  var contactPersonName = req.body.contactPersonName
    ? req.body.contactPersonName
    : "";
  var mobileNo = req.body.mobileNo ? req.body.mobileNo : "";
  var email = req.body.email ? req.body.email : "";
  var pincode = req.body.pincode ? req.body.pincode : "";
  var state = req.body.state ? req.body.state : "";
  var city = req.body.city ? req.body.city : "";
  // var district = req.body.district ? req.body.district : "";
  var address1 = req.body.address1 ? req.body.address1 : "";
  var address2 = req.body.address2 ? req.body.address2 : "";
  var DOB = req.body.DOB ? req.body.DOB : "";
  var DOA = req.body.DOA ? req.body.DOA : "";
  var route = req.body.route ? req.body.route : "";
  if (partyType != "") {
    if (firmName != "") {
      if (mobileNo != "") {
        if (pincode != "") {
          if (city != "") {
            if (state != "") {
              // if (district != "") {
                if (address1 != "") {
                  Employee.findOne({ _id: employee_id })
                    .exec()
                    .then(async(emp_data) => {
                      console.log("employee", emp_data);
                      let company = await Admin.findOne({_id:emp_data.companyId});
                      var party_data = await Party.findOne({company_id:company._id}).sort({party_code:-1});
                      console.log("party_data------------",party_data)
                      let party_code;
                      if(party_data){
                        party_code = party_data.party_code + 1;
                      }else{
                        party_code = 1;
                      }
                      var new_party = new Party({
                        partyType: partyType,
                        firmName: firmName,
                        GSTNo: GSTNo,
                        contactPersonName: contactPersonName,
                        company_code:company.companyShortCode,
                        party_code:party_code,
                        mobileNo: mobileNo,
                        email: email,
                        company_id: emp_data.companyId,
                        employee_id: emp_data._id,
                        pincode: pincode,
                        state: state,
                        route: route,
                        city: city,
                        // district: district,
                        address1: address1,
                        address2: address2,
                        DOB: DOB,
                        DOA: DOA,
                        Created_date: get_current_date(),
                        Updated_date: get_current_date(),
                        status: "UnApproved",
                      });
                      new_party.save().then((data) => {
                        res.status(200).json({
                          status: true,
                          message: "Party created successfully",
                          result: data,
                        });
                      });
                    });
                } else {
                  res.json({
                    status: false,
                    message: "address is required",
                  });
                }
              // } else {
              //   res.json({
              //     status: false,
              //     message: "district is required",
              //   });
              // }
            } else {
              res.json({
                status: false,
                message: "state is required",
              });
            }
          } else {
            res.json({
              status: false,
              message: "City is required",
            });
          }
        } else {
          res.json({
            status: false,
            message: "pincode is required",
          });
        }
      } else {
        res.json({
          status: false,
          message: "Mobile Number is required",
        });
      }
    } else {
      res.json({
        status: false,
        message: "Firm Name is required",
      });
    }
  } else {
    res.json({
      status: false,
      message: "partyType is required",
    });
  }
});

router.post("/getAllPartyEmp", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json({status: false,message: "Token must be provided",});
  let x = token.split(".")
  if(x.length<3) return res.send({status:false,message:"Invalid token"})
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  var page = req.body.page ? req.body.page : "1";
  var limit = 10;
  var count = await Party.find({ employee_id });
  var list = [];
  Party.find({ employee_id }).sort({"status":-1}).limit(limit * 1).skip((page - 1) * limit).exec().then(async (party_data) => {
      if (party_data.length > 0) {
        let counInfo = 0;
        for (let i = 0; i < party_data.length; i++) {
          let state_data = await Location.findOne({ _id: party_data[i].state });
          let city_data = await Location.findOne({ _id: party_data[i].city });
          // let district_data = await Location.findOne({ _id: party_data[i].district });
          let party_type_data = await PartyType.findOne({ _id: party_data[i].partyType });
          await (async function (rowData) {
            var u_data = {
              id: rowData._id,
              state: { name: state_data.name, id: rowData.state },
              city: { name: city_data.name, id: rowData.city },
              // district: {name: district_data.name,id: rowData.district,},
              firmName: rowData.firmName,
              party_unique_id:`${rowData.company_code}${rowData.party_code}`,
              address1: rowData.address1,
              address2: rowData.address2,
              partyType: party_type_data.party_type,
              image: rowData.image,
              pincode: rowData.pincode,
              GSTNo: rowData.GSTNo,
              contactPersonName: rowData.contactPersonName,
              mobileNo: rowData.mobileNo,
              email: rowData.email,
              DOB: rowData.DOB,
              DOA: rowData.DOA,
              route: rowData.route,
              status: rowData.status,
            };
            list.push(u_data);
          })(party_data[i]);
          counInfo++;
          if (counInfo == party_data.length) {
            let c = Math.ceil(count.length / limit);
            if (c == 0) {
              c += 1;
            }
             return res.json({status: true,message: "All Parties found successfully",result: list,pageLength: c,});
          }
        }
      } else {
        return res.json({status: true,message: "No party found",result: [],});
      }
    });
});

router.post('/authorizedParty',(req,res)=>{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      status: false,
      message: "Token must be provided",
    });
  }
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  beat_id = req.body.beat_id?req.body.beat_id:"";
  if(beat_id==""){
    return res.send({
      status:false,
      message:"First select beat",
      result:[]
    })
  }
  Employee.findOne({_id:employee_id}).exec().then(emp_data=>{
    Beat.findOne({_id:beat_id}).exec().then(beat_data=>{
      let final_arr = []
      if(!beat_data) return res.send({status:true, message:"No Beat found", result:[] }) 
      Party.find({company_id:emp_data.companyId}).exec().then(party_data=>{
        if(party_data.length<1) return res.send({status:true, message:"No party found", result:[] }) 
        let count = 0;
        let route_arr = beat_data.route;
        console.log(route_arr);
        for(let x = 0;x<route_arr.length;x++){
          console.log(route_arr[x]);
          for(let i = 0;i<party_data.length;i++){
            console.log(party_data[i])
            console.log(party_data[i].route)
            if(party_data[i].route==null){
              continue;
            }else{
              var arr = party_data[i].route[0]?party_data[i].route[0].split(","):"";
              if(arr==""){
                console.log("inside first if")
                if(count==party_data.length-1){
                  res.json({
                    status:true,
                    message:"No party data found",
                    result:[]
                  })
                }
              }else{
                console.log("insidde else");
                console.log(arr.length);
                for(let j = 0;j<arr.length;j++){
                  console.log("inside for");
                  if(arr[j]==route_arr[x]){
                    console.log("insidde if");
                    final_arr.push(party_data[i])
                  }
                }
              }
            }
          }
          count++;
          if(final_arr==[]){
            return res.json({
              status:true,
              message:"Authorized party not found",
              result:[]
            })
          }else{
            return res.json({
              status:true,
              message:"Authorized parties found",
              result:final_arr
            }) 
          }
        }
      })
    })
  })

})

router.post("/getParty", (req, res) => {
  var id = req.body.id ? req.body.id : "";
  var list = [];
  if (id != "") {
    Party.findOne({ _id: id })
      .exec()
      .then((party_data) => {
        if (party_data) {
          Location.findOne({ _id: party_data.state })
            .exec()
            .then((state_data) => {
              Location.findOne({ _id: party_data.city })
                .exec()
                .then((city_data) => {
                  // Location.findOne({ _id: party_data.district })
                  //   .exec()
                  //   .then((district_data) => {
                      PartyType.findOne({ _id: party_data.partyType })
                        .exec()
                        .then((party_type_data) => {
                      //console.log(party_data.route[0])
                      var arr = party_data.route
                        ? party_data.route[0].split(",")
                        : "";
                      console.log(arr);
                      if (arr == "") {
                        var u_data = {
                          id: party_data._id,
                          state: {
                            name: state_data.name,
                            id: party_data.state,
                          },
                          city: { name: city_data.name, id: party_data.city },
                          // district: {
                          //   name: district_data.name,
                          //   id: party_data.district,
                          // },
                          firmName: party_data.firmName,
                          party_unique_id:`${rowData.company_code}${rowData.party_code}`,
                          address1: party_data.address1,
                          address2: party_data.address2,
                          partyType: party_type_data.party_type,
                          image: party_data.image,
                          pincode: party_data.pincode,
                          GSTNo: party_data.GSTNo,
                          contactPersonName: party_data.contactPersonName,
                          mobileNo: party_data.mobileNo,
                          email: party_data.email,
                          DOB: party_data.DOB,
                          DOA: party_data.DOA,
                          route: list,
                        };
                        res.json({
                          status: true,
                          message: " Party found successfully",
                          result: u_data,
                        });
                      } else {
                        for (let i = 0; i < arr.length; i++) {
                          console.log(i);
                          console.log(arr[i]);
                          Route.findOne({ _id: arr[i] })
                            .exec()
                            .then((route_data) => {
                              console.log("routedata", route_data);
                              let data = {
                                route_name:route_data.route_name,
                                id: route_data._id,
                              };
                              list.push(data);
                              console.log(list);
                              if (arr.length == i + 1) {
                                var u_data = {
                                  id: party_data._id,
                                  state: {
                                    name: state_data.name,
                                    id: party_data.state,
                                  },
                                  city: {
                                    name: city_data.name,
                                    id: party_data.city,
                                  },
                                  // district: {
                                  //   name: district_data.name,
                                  //   id: party_data.district,
                                  // },
                                  firmName: party_data.firmName,
                                  party_unique_id:`${rowData.company_code}${rowData.party_code}`,
                                  address1: party_data.address1,
                                  address2: party_data.address2,
                                  partyType: party_type_data.party_type,
                                  image: party_data.image,
                                  pincode: party_data.pincode,
                                  GSTNo: party_data.GSTNo,
                                  contactPersonName:
                                    party_data.contactPersonName,
                                  mobileNo: party_data.mobileNo,
                                  email: party_data.email,
                                  DOB: party_data.DOB,
                                  DOA: party_data.DOA,
                                  route: list,
                                };
                                res.json({
                                  status: true,
                                  message: " Party found successfully",
                                  result: u_data,
                                });
                              }
                            });
                        }
                      }
                    });
                  // })
                });
            });
        } else {
          res.json({
            status: true,
            message: "Party data not found",
            result: [],
          });
        }
      });
  } else {
    res.json({
      status: false,
      message: "Id is required",
    });
  }
});

router.post("/addBeatEmp", (req, res) => {
  console.log(req.body);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      status: false,
      message: "Token must be provided",
    });
  }
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  var beatName = req.body.beatName ? req.body.beatName : "";
  var state = req.body.state ? req.body.state : "";
  var city = req.body.city ? req.body.city : "";
  var day = req.body.day ? req.body.day : "";
  var route_id_arr = req.body.route_id_arr ? req.body.route_id_arr : null;
  if (state != "") {
    if (city != "") {
      if (beatName != "") {
        if (employee_id != "") {
          if (day != "") {
            if (route_id_arr != null) {
              Employee.findOne({ _id: employee_id }).exec().then((emp_data) => {
                  Beat.find({ beatName: beatName }).exec().then((beat_info) => {
                      if (beat_info.length < 1) {
                        var new_beat = new Beat({
                          beatName: beatName,
                          employee_id: emp_data._id,
                          day: day,
                          state: state,
                          city: city,
                          company_id: emp_data.companyId,
                          route: route_id_arr,
                          Created_date: get_current_date(),
                          Updated_date: get_current_date(),
                          status: "UnApproved",
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
                          result: [],
                        });
                      }
                    });
                });
            } else {
              return res.json({
                status: false,
                message: "Routes are required",
              });
            }
          } else {
            return res.json({
              status: false,
              message: "Day is required",
            });
          }
        } else {
          return res.json({
            status: false,
            message: "Employee id is required",
          });
        }
      } else {
        return res.json({
          status: false,
          message: "Beat Name is required",
        });
      }
    } else {
      return res.json({
        status: false,
        message: "City is required",
      });
    }
  } else {
    return res.json({
      status: false,
      message: "State is required",
    });
  }
});

router.post("/getAllBeat", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      status: false,
      message: "Token must be provided",
    });
  }
  var page = req.body.page ? req.body.page : "1";
  var limit = 10;
  var count = await Beat.find({ company_id });
  var list = [];
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  Beat.find({ employee_id }).sort({"status":-1}).limit(limit * 1).skip((page - 1) * limit).sort({ Created_date: -1 }).exec().then(async (beat_data) => {
      let counInfo = 0;
      if (beat_data.length > 0) {
        for (let i = 0; i < beat_data.length; i++) {
          let emp_data = await Employee.findOne({ _id: beat_data[i].employee_id })
          if (!emp_data) {
            res.json({
              status: true,
              message: "No employee found",
            });
          }
          console.log(beat_data[i].employee_id);
          let list2 = beat_data[i].route
            let arr = [];
            for(let x = 0;x<list2.length;x++){
              var route_data = await Route.findOne({_id: list2[x]});
              let u_data = {
                route_name:route_data.route_name,
              }
              arr.push(u_data);
            }
          let state_data = await Location.findOne({ _id: beat_data[i].state })
          let city_data = await Location.findOne({ _id: beat_data[i].city })
          await (async function (rowData) {
            var u_data = {
              id: rowData._id,
              state: {
                name: state_data.name,
                id: beat_data[i].state,
              },
              city: {
                name: city_data.name,
                id: beat_data[i].city,
              },
              employee_name: emp_data.employeeName,
              route:arr,
              beatName: rowData.beatName,
              day: rowData.day,
              status: rowData.status,
            };
            list.push(u_data);
          })(beat_data[i]);
          counInfo++;
          if (counInfo == beat_data.length) {
            let c = Math.ceil(count.length / limit);
            if (c == 0) {
              c += 1;
            }
            res.json({
              status: true,
              message: "All Beats found successfully",
              result: list,
              pageLength: c,
            });
          }
        }
      } else {
        return res.json({
          status: true,
          message: "Beat not found",
          result: [],
        });
      }
    });
});

router.post("/beatListing", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      status: false,
      message: "Token must be provided",
    });
  }
  var list = [];
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  Beat.find({ employee_id }).sort({ Created_date: -1 }).exec().then(async (beat_data) => {
      let counInfo = 0;
      if (beat_data.length > 0) {
        for (let i = 0; i < beat_data.length; i++) {
          let emp_data = await Employee.findOne({ _id: beat_data[i].employee_id })
          if (!emp_data) {
            res.json({
              status: true,
              message: "No employee found",
            });
          }
          console.log(beat_data[i].employee_id);
            let list2 = beat_data[i].route
            let arr = [];
            for(let x = 0;x<list2.length;x++){
              var route_data = await Route.findOne({_id: list2[x]});
              let u_data = {
                route_name:route_data.route_name,
              }
              arr.push(u_data);
            }
            let state_data = await Location.findOne({ _id: beat_data[i].state })
            let city_data = await Location.findOne({ _id: beat_data[i].city })
            await (async function (rowData) {
              var u_data = {
                id: rowData._id,
                state: {
                  name: state_data.name,
                  id: beat_data[i].state,
                },
                city: {
                  name: city_data.name,
                  id: beat_data[i].city,
                },
                employee_name: emp_data.employeeName,
                route:arr,
                beatName: rowData.beatName,
                day: rowData.day,
                status: rowData.status,
              };
              list.push(u_data);
            })(beat_data[i]);
            counInfo++;
            if (counInfo == beat_data.length) {
              res.json({
                status: true,
                message: "All Beats found successfully",
                result: list,
              });
            }
        }
      } else {
        return res.json({
          status: true,
          message: "Beat not found",
          result: [],
        });
      }
    });
});

router.post("/getBeat", async (req, res) => {
  var id = req.body.id ? req.body.id : "";
  let beat_data = await Beat.findOne({ _id: id })
  if (beat_data) {
    let state_data = await Location.findOne({ _id: beat_data.state })
    let city_data = await Location.findOne({ _id: beat_data.city })
    let emp_data = await Employee.findOne({ _id: beat_data.employee_id })
    let list2 = beat_data[i].route
    let arr = [];
    for(let x = 0;x<list2.length;x++){
      var route_data = await Route.findOne({_id: list2[x]});
      let u_data = {
        route_name:route_data.route_name,
      }
      arr.push(u_data);
    }
    var u_data = {
      id: beat_data._id,
      state: { name: state_data.name, id: beat_data.state },
      city: { name: city_data.name, id: beat_data.city },
      employee_name: emp_data.employeeName,
      route:arr,
      day: beat_data.day,
      beatName: beat_data.beatName,
      status: beat_data.status,
    };
    res.json({
      status: true,
      message: "data fetched",
      result: [u_data],
    });                     
  } else {
      res.json({
        status: false,
        message: "Beat not found",
        result: [],
      });
    }
});

router.post("/editBeat", (req, res) => {
  var id = req.body.id ? req.body.id : "";
  if (id != "") {
    Beat.find({ _id: id })
      .exec()
      .then((beat_data) => {
        if (beat_data.length > 0) {
          var updated_beat = {};
          if (req.body.beatName) {
            updated_beat.beatName = req.body.beatName;
          }
          if (req.body.day) {
            updated_beat.day = req.body.day;
          }
          if (req.body.state) {
            updated_beat.state = req.body.state;
          }
          if (req.body.city) {
            updated_beat.city = req.body.city;
          }
          if (req.body.route_id_arr) {
            updated_beat.route = req.body.route_id_arr;
          }
          updated_beat.Updated_date = get_current_date();
          Beat.findOneAndUpdate(
            { _id: id },
            updated_beat,
            { new: true },
            (err, doc) => {
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
  } else {
    return res.json({
      status: false,
      message: "Id is required",
      result: null,
    });
  }
});

router.post("/addRoute", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.json({
      status: false,
      message: "Please give token",
    });
  }
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  var state = req.body.state ? req.body.state : "";
  var distance = req.body.distance ? req.body.distance : "";
  var city = req.body.city ? req.body.city : "";
  var route_name = req.body.route_name ? req.body.route_name : "";
  // var area = req.body.area ? req.body.area : "";
  var start_point = req.body.start_point ? req.body.start_point : "";
  var end_point = req.body.end_point ? req.body.end_point : "";
  if (state != "") {
    if (city != "") {
      // if (area != "") {
        if (start_point != "") {
          if (end_point != "") {
            Employee.findOne({ _id: employee_id })
              .exec()
              .then((emp_data) => {
                if (!emp_data) {
                  res.json({
                    status: true,
                    message: "No employee found",
                    result: [],
                  });
                } else {
                  var new_route = new Route({
                    state: state,
                    city: city,
                    route_name: route_name,
                    distance: distance,
                    start_point: start_point,
                    company_id: emp_data.companyId,
                    end_point: end_point,
                    Created_date: get_current_date(),
                    Updated_date: get_current_date(),
                    status: "Active",
                  });
                  new_route.save().then((data) => {
                    res.json({
                      status: true,
                      message: "Route created successfully",
                      result: data,
                    });
                  });
                }
              });
          } else {
            res.json({
              status: false,
              message: "End point must be specified is required.",
            });
          }
        } else {
          res.json({
            status: false,
            message: "Starting point  is required.",
          });
        }
      // } else {
      //   res.json({
      //     status: false,
      //     message: "Area is required.",
      //   });
      // }
    } else {
      res.json({
        status: false,
        message: "City is required.",
      });
    }
  } else {
    res.json({
      status: false,
      message: "State is required.",
    });
  }
});

// router.post("/routeListing", (req, res) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
//     res.json({
//       status: false,
//       message: "Please give token",
//     });
//   }
//   let x = token.split(".")
  // if(x.length<3){
  //   return res.send({status:false,message:"Invalid token"})
  // }
  // var decodedToken = jwt.verify(token, "test");
//   var employee_id = decodedToken.user_id;
//   var state = req.body.state ? req.body.state : "";
//   var city = req.body.city ? req.body.city : "";
//   // var area = req.body.area ? req.body.area : "";
//   var limit = 10;
//   var list = [];
//   Employee.findOne({ _id: employee_id })
//     .exec()
//     .then(async (emp_data) => {
//       if (!emp_data) {
//         return res.json({
//           status: true,
//           message: "No employee found . Please check the token",
//         });
//       }
//       var count = await Route.find({ company_id: emp_data.companyId });
//       let arr = [];
//       if (state != "" && city == "") {
//         arr.push({ company_id: emp_data.companyId }, { state });
//       } else if (state != "" && city != "") {
//         arr.push({ company_id: emp_data.companyId }, { state }, { city });
//       } else {
//         arr.push({ company_id: emp_data.companyId });
//       }

//       Route.find({ $and: arr })
//         .exec()
//         .then((route_data) => {
//           if (route_data.length > 0) {
//             let counInfo = 0;
//             for (let i = 0; i < route_data.length; i++) {
//               Location.findOne({ _id: route_data[i].state })
//                 .exec()
//                 .then((state_data) => {
//                   Location.findOne({ _id: route_data[i].city })
//                     .exec()
//                     .then((city_data) => {
//                       Location.findOne({ _id: route_data[i].area })
//                         .exec()
//                         .then(async (area_data) => {
//                           await (async function (rowData) {
//                             var u_data = {
//                               id: rowData._id,
//                               state: {
//                                 name: state_data.name,
//                                 id: rowData.state,
//                               },
//                               city: {
//                                 name: city_data.name,
//                                 id: rowData.city,
//                               },
//                               area: {
//                                 name: area_data.name,
//                                 id: rowData.area,
//                               },
//                               start_point: rowData.start_point,
//                               distance: rowData.distance,
//                               end_point: rowData.end_point,
//                             };
//                             list.push(u_data);
//                           })(route_data[i]);
//                           counInfo++;
//                           if (counInfo == route_data.length) {
//                             res.json({
//                               status: true,
//                               message: "All Routes found successfully",
//                               result: list,
//                               pageLength: Math.ceil(count.length / limit),
//                             });
//                           }
//                         });
//                     });
//                 });
//             }
//           } else {
//             res.json({
//               status: false,
//               message: "No route found for this state",
//               result: [],
//             });
//           }
//         });
//     });
// });

router.post("/routeListing", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.json({
      status: false,
      message: "Please give token",
    });
  }
  let x = token.split(".")
  if(x.length<3){
    return res.send({status:false,message:"Invalid token"})
  }
  var decodedToken = jwt.verify(token, "test");
  var employee_id = decodedToken.user_id;
  var state = req.body.state ? req.body.state : "";
  var city = req.body.city ? req.body.city : "";
  var list = [];
  Employee.findOne({ _id: employee_id }).exec().then(async (emp_data) => {
      if (!emp_data) {
        return res.json({
          status: true,
          message: "No employee found . Please check the token",
        });
      }
      let arr = [];
      if (state != "" && city == "") {
        arr.push({ company_id: emp_data.companyId }, { state });
      } else if (state != "" && city != "") {
        arr.push({ company_id: emp_data.companyId }, { state }, { city });
      } else {
        arr.push({ company_id: emp_data.companyId });
      }

      Route.find({ $and: arr })
        .exec()
        .then((route_data) => {
          if (route_data.length > 0) {
            let counInfo = 0;
            for (let i = 0; i < route_data.length; i++) {
              Location.findOne({ _id: route_data[i].state }).exec().then((state_data) => {
                  Location.findOne({ _id: route_data[i].city })
                    .exec()
                    .then((city_data) => {
                      // Location.findOne({ _id: route_data[i].area })
                      //   .exec()
                      //   .then(async (area_data) => {
                          await (async function (rowData) {
                            var u_data = {
                              id: rowData._id,
                              state: {
                                name: state_data.name,
                                id: rowData.state,
                              },
                              city: {
                                name: city_data.name,
                                id: rowData.city,
                              },
                              route_name:rowData.route_name,
                              start_point: rowData.start_point,
                              distance: rowData.distance,
                              end_point: rowData.end_point,
                            };
                            list.push(u_data);
                          })(route_data[i]);
                          counInfo++;
                          if (counInfo == route_data.length) {
                            res.json({
                              status: true,
                              message: "All Routes found successfully",
                              result: list,
                            });
                          }
                        // });
                    });
                });
            }
          } else {
            res.json({
              status: false,
              message: "No route found for this state",
              result: [],
            });
          }
        });
    });
});

router.post("/edit_route", (req, res) => {
  var id = req.body.id ? req.body.id : "";
  if (id != "") {
    var updated_route = {};
    if (req.body.state) {
      updated_route.state = req.body.state;
    }
    if (req.body.city) {
      updated_route.city = req.body.city;
    }
    if (req.body.route_name) {
      updated_route.route_name = req.body.route_name;
    }
    if (req.body.distance) {
      updated_route.distance = req.body.distance;
    }
    if (req.body.start_point) {
      updated_route.start_point = req.body.start_point;
    }
    if (req.body.end_point) {
      updated_route.end_point = req.body.end_point;
    }
    Route.findOneAndUpdate(
      { _id: id },
      updated_route,
      { new: true },
      (err, doc) => {
        if (doc) {
          res.json({
            status: true,
            message: "Route updated successfully",
            result: updated_route,
          });
        } else {
          res.json({
            status: false,
            message: "Error",
            result: err,
          });
        }
      }
    );
  } else {
    res.json({
      status: false,
      message: "Id is required.",
    });
  }
});

//   router.delete("/deleteRoute", (req, res) => {
//     var id = req.body.id ? req.body.id : "";
//     Route.deleteOne({ _id: id })
//       .exec()
//       .then(() => {
//         res.json({
//           status: true,
//           message: "Deleted successfully",
//         });
//       });
//   });

module.exports = router;
