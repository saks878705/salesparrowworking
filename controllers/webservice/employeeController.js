const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const Location = mongoose.model("Location");
const Admin = mongoose.model("AdminInfo");
const Role = mongoose.model("role");
const router = express.Router();
const base_url = "http://salesparrow.herokuapp.com/";
const multer = require("multer");
const sid = "ACc3f03d291aaa9b78b8088eb0b77bf616";
const auth_token = "b088eeb84d39bd2cc2679faea930b620";
const twilio = require("twilio")(sid, auth_token);
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");
const { AuthorizationDocumentInstance } = require("twilio/lib/rest/preview/hosted_numbers/authorizationDocument");

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

router.post(
  "/addEmployee",
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
    var decodedToken = jwt.verify(token, "test");
    var user_id = decodedToken.user_id;
    var employeeName = req.body.employeeName ? req.body.employeeName : "";
    var headquarterState = req.body.headquarterState
      ? req.body.headquarterState
      : "";
    var headquarterCity = req.body.headquarterCity
      ? req.body.headquarterCity
      : "";
    var phone = req.body.phone ? req.body.phone : "";
    var email = req.body.email ? req.body.email : "";
    var address = req.body.address ? req.body.address : "";
    var state = req.body.state ? req.body.state : "";
    var city = req.body.city ? req.body.city : "";
    var pincode = req.body.pincode ? req.body.pincode : "";
    var district = req.body.district ? req.body.district : "";
    var experience = req.body.experience ? req.body.experience : "";
    var qualification = req.body.qualification ? req.body.qualification : "";
    if (employeeName != "") {
      if (phone != "") {
        if (email != "") {
          if (address != "") {
            Employee.find({ email: email }).exec().then(async (email_info) => {
                if (email_info.length < 1) {
                  let company = await Admin.findOne({_id:user_id});
                  var emp_data = await Employee.findOne({companyId:company._id}).sort({employee_code:-1});
                  if(emp_data){
                    var employee_code = emp_data.employee_code + 1;
                  }else{
                    var employee_code = 0000;
                  }
                  var new_employee = new Employee({
                    employeeName: employeeName,
                    phone: phone,
                    email: email,
                    address: address,
                    company_code:company.companyShortCode+"E",
                    employee_code:employee_code,
                    headquarterState: headquarterState,
                    headquarterCity: headquarterCity,
                    city: city,
                    companyId: user_id,
                    image: base_url + req.files.Employee_image[0].path,
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
                    console.log(data)
                    res.status(200).json({
                      status: true,
                      message: "New Employee is created successfully",
                      results: data,
                    });
                  });
                } else {
                  res.json({
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
  }
);

router.patch("/editEmployee", (req, res) => {
  var id = req.body.id ? req.body.id : "";
  if (id != "") {
    Employee.find({ _id: id })
      .exec()
      .then(async (employee_info) => {
        if (employee_info.length > 0) {
          var updated_employee = {};
          if (req.body.employeeName) {
            updated_employee.employeeName = req.body.employeeName;
          }
          if (req.body.userExpenses) {
            updated_employee.userExpenses = req.body.userExpenses;
          }
          if (req.body.headquarterState) {
            updated_employee.headquarterState = req.body.headquarterState;
          }
          if (req.body.headquarterCity) {
            updated_employee.headquarterCity = req.body.headquarterCity;
          }
          if (req.body.transportWays) {
            updated_employee.transportWays = req.body.transportWays;
          }
          if (req.body.roleId) {
            updated_employee.roleId = req.body.roleId;
          }
          if (req.body.manager) {
            updated_employee.manager = req.body.manager;
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
          if (req.body.status) {
            updated_employee.status = req.body.status;
          }
          updated_employee.Updated_date = get_current_date();
          Employee.findOneAndUpdate(
            { _id: id },
            updated_employee,
            { new: true },
            (err, doc) => {
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

router.post("/getAllEmployee", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      status: false,
      message: "Token must be provided",
    });
  }
  var decodedToken = jwt.verify(token, "test");
  var user_id = decodedToken.user_id;
  var page = req.body.page ? req.body.page : "1";
  var state = req.body.state ? req.body.state : "";
  var city = req.body.city ? req.body.city : "";
  var limit = 10;
  let count = await Employee.find({ companyId: user_id });
  let arr = [];
  if (state != "" && city == "") {
    arr.push({ companyId: user_id }, { state });
  } else if (state != "" && city != "") {
    arr.push({ companyId: user_id }, { state }, { city });
  } else {
    arr.push({ companyId: user_id });
  }
  console.log(arr);
  var list = [];
  Employee.find({ $and: arr })
    .sort({ status: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()
    .then(async (emp_data) => {
      console.log(emp_data);
      if (emp_data.length > 0) {
        let counInfo = 0;
        for (let i = 0; i < emp_data.length; i++) {
          let role_data = await Role.findOne({ _id: emp_data[i].roleId });
          if (!role_data) {
            await (async function (rowData) {
              let state_data = await Location.findOne({
                _id: emp_data[i].state,
              });
              let headquarter_state_data = await Location.findOne({
                _id: emp_data[i].headquarterState,
              });
              let headquarter_city_data = await Location.findOne({
                _id: emp_data[i].headquarterCity,
              });
              let city_data = await Location.findOne({ _id: emp_data[i].city });
              let area_data = await Location.findOne({
                _id: emp_data[i].district,
              });
              var u_data = {
                id: rowData._id,
                employeeName: rowData.employeeName,
                phone: rowData.phone,
                email: rowData.email,
                address: rowData.address,
                employee_code:rowData.employee_code?rowData.employee_code:0,
                company_code:rowData.company_code?rowData.company_code:"",
                pincode: rowData.pincode,
                image: rowData.image,
                state: {
                  name: state_data.name,
                  id: state_data._id,
                },
                headquarterState: {
                  name: headquarter_state_data
                    ? headquarter_state_data.name
                    : "",
                  id: headquarter_state_data ? headquarter_state_data._id : "",
                },
                headquarterCity: {
                  name: headquarter_city_data ? headquarter_city_data.name : "",
                  id: headquarter_city_data ? headquarter_city_data._id : "",
                },
                city: {
                  name: city_data.name,
                  id: city_data._id,
                },
                district: {
                  name: area_data.name,
                  id: area_data._id,
                },
                experience: rowData.experience,
                qualification: rowData.qualification,
                status: rowData.status,
                role: "SA",
              };
              list.push(u_data);
            })(emp_data[i]);
            counInfo++;
            if (counInfo == emp_data.length) {
              res.json({
                status: true,
                message: "All Employees found successfully",
                result: list,
                pageLength: Math.ceil(count.length / limit),
              });
            }
          } else {
            await (async function (rowData) {
              let state_data = await Location.findOne({
                _id: emp_data[i].state,
              });
              let headquarter_state_data = await Location.findOne({
                _id: emp_data[i].headquarterState,
              });
              let headquarter_city_data = await Location.findOne({
                _id: emp_data[i].headquarterCity,
              });
              let city_data = await Location.findOne({ _id: emp_data[i].city });
              let area_data = await Location.findOne({
                _id: emp_data[i].district,
              });
              let role_data = await Role.findOne({ _id: emp_data[i].roleId });
              var u_data = {
                id: rowData._id,
                employeeName: rowData.employeeName,
                phone: rowData.phone,
                email: rowData.email,
                address: rowData.address,
                employee_code:rowData.employee_code?rowData.employee_code:0,
                company_code:rowData.company_code?rowData.company_code:"",
                pincode: rowData.pincode,
                image: rowData.image,
                state: {
                  name: state_data.name,
                  id: state_data._id,
                },
                headquarterState: {
                  name: headquarter_state_data
                    ? headquarter_state_data.name
                    : "",
                  id: headquarter_state_data ? headquarter_state_data._id : "",
                },
                headquarterCity: {
                  name: headquarter_city_data ? headquarter_city_data.name : "",
                  id: headquarter_city_data ? headquarter_city_data._id : "",
                },
                city: {
                  name: city_data.name,
                  id: city_data._id,
                },
                district: {
                  name: area_data.name,
                  id: area_data._id,
                },
                experience: rowData.experience,
                qualification: rowData.qualification,
                status: rowData.status,
                role: role_data.rolename,
              };
              list.push(u_data);
            })(emp_data[i]);
            counInfo++;
            if (counInfo == emp_data.length) {
              res.json({
                status: true,
                message: "All Employees found successfully",
                result: list,
                pageLength: Math.ceil(count.length / limit),
              });
            }
          }
        }
      } else {
        res.json({
          status: false,
          message: "No employee found",
          result: [],
        });
      }
    });
});

router.post(
  "/employeeProfileImage",
  imageUpload.fields([{ name: "Employee_image" }]),
  (req, res) => {
    console.log(req.files);
    const id = req.body.id ? req.body.id : "";
    if (id != "") {
      Employee.find({ _id: id })
        .exec()
        .then((user_data) => {
          if (user_data) {
            updated_employee = {};
            if (req.files.Employee_image) {
              updated_employee.image =
                base_url + req.files.Employee_image[0].path;
            }
            Employee.findOneAndUpdate(
              { _id: id },
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
    } else {
      res.json({
        status: false,
        message: "Id is required.",
      });
    }
  }
);

router.delete("/deleteEmployee", (req, res) => {
  var id = req.body.id ? req.body.id : "";
  Employee.findOneAndDelete({ _id: id })
    .exec()
    .then((employee_data) => {
      res.json({
        status: true,
        message: "Employee deleted successfully",
      });
    });
});

router.post("/getEmp", (req, res) => {
  var id = req.body.id ? req.body.id : "";
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.json({
      status: false,
      message: "Token is required",
    });
  }
  var decodedToken = jwt.verify(token, "test");
  var user_id = decodedToken.user_id;
  Employee.findOne({ $and: [{ _id: id }, { companyId: user_id }] })
    .exec()
    .then((employee_data) => {
      console.log(employee_data);
      if (!employee_data) {
        return res.json({
          status: true,
          message: "No employee found",
        });
      }
      Location.findOne({ _id: employee_data.state })
        .exec()
        .then((state_data) => {
          Location.findOne({ _id: employee_data.headquarterState })
            .exec()
            .then((headquarter_state_data) => {
              Location.findOne({ _id: employee_data.headquarterCity })
                .exec()
                .then((headquarter_city_data) => {
                  Location.findOne({ _id: employee_data.city })
                    .exec()
                    .then((city_data) => {
                      Location.findOne({ _id: employee_data.district })
                        .exec()
                        .then(async (area_data) => {
                          if (!employee_data.roleId) {
                            var u_data = {
                              employeeName: employee_data.employeeName,
                              roleId: "",
                              companyId: employee_data.companyId,
                              phone: employee_data.phone,
                              email: employee_data.email,
                              company_code:employee_data.company_code?employee_data.company_code:"",
                              employee_code:employee_data.employee_code?employee_data.employee_code:"",
                              address: employee_data.address,
                              pincode: employee_data.pincode,
                              state: state_data.name,
                              headquarterState: headquarter_state_data.name,
                              headquarterCity: headquarter_city_data.name,
                              image: employee_data.image,
                              city: city_data.name,
                              district: area_data.name,
                              experience: employee_data.experience,
                              qualification: employee_data.qualification,
                              userExpenses: employee_data.userExpenses,
                              transportWays: employee_data.transportWays,
                              status: employee_data.status,
                            };
                            res.json({
                              status: true,
                              message: "Employee found successfully",
                              result: u_data,
                            });
                          } else {
                            Employee.findOne({
                              $and: [{ _id: id }, { companyId: user_id }],
                            })
                              .exec()
                              .then((employee_data) => {
                                console.log(
                                  "inside else ----------",
                                  employee_data
                                );
                                console.log(
                                  "inside else ----------",
                                  employee_data.manager
                                );
                                Role.findOne({ _id: employee_data.roleId })
                                  .exec()
                                  .then((role_data) => {
                                    if (
                                      employee_data.manager == "" ||
                                      employee_data.manager == undefined
                                    ) {
                                      var u_data = {
                                        employeeName:
                                          employee_data.employeeName,
                                        roleId: {
                                          name: role_data.rolename,
                                          id: role_data._id,
                                        },
                                        companyId: employee_data.companyId,
                                        phone: employee_data.phone,
                                        email: employee_data.email,
                                        company_code:employee_data.company_code?employee_data.company_code:"",
                                        employee_code:employee_data.employee_code?employee_data.employee_code:"",
                                        address: employee_data.address,
                                        pincode: employee_data.pincode,
                                        state: state_data.name,
                                        headquarterState:
                                          headquarter_state_data.name,
                                        headquarterCity:
                                          headquarter_city_data.name,
                                        image: employee_data.image,
                                        city: city_data.name,
                                        district: area_data.name,
                                        experience: employee_data.experience,
                                        qualification:
                                          employee_data.qualification,
                                        userExpenses:
                                          employee_data.userExpenses,
                                        transportWays:
                                          employee_data.transportWays,
                                        status: employee_data.status,
                                      };
                                      res.json({
                                        status: true,
                                        message: "Employee found successfully",
                                        result: u_data,
                                      });
                                    } else {
                                      Employee.findOne({
                                        _id: employee_data.manager,
                                      })
                                        .exec()
                                        .then((manager_data) => {
                                          var u_data = {
                                            employeeName:
                                              employee_data.employeeName,
                                            roleId: {
                                              name: role_data.rolename,
                                              id: role_data._id,
                                            },
                                            companyId: employee_data.companyId,
                                            manager: manager_data.employeeName,
                                            phone: employee_data.phone,
                                            company_code:employee_data.company_code?employee_data.company_code:"",
                                            employee_code:employee_data.employee_code?employee_data.employee_code:"",
                                            email: employee_data.email,
                                            address: employee_data.address,
                                            pincode: employee_data.pincode,
                                            state: state_data.name,
                                            headquarterState:
                                              headquarter_state_data.name,
                                            headquarterCity:
                                              headquarter_city_data.name,
                                            image: employee_data.image,
                                            city: city_data.name,
                                            district: area_data.name,
                                            experience:
                                              employee_data.experience,
                                            qualification:
                                              employee_data.qualification,
                                            userExpenses:
                                              employee_data.userExpenses,
                                            transportWays:
                                              employee_data.transportWays,
                                            status: employee_data.status,
                                          };
                                          res.json({
                                            status: true,
                                            message:
                                              "Employee found successfully",
                                            result: u_data,
                                          });
                                        });
                                    }
                                  });
                              });
                          }
                        });
                    });
                });
            });
        });
    });
});

router.post(
  "/bulkImportEmployee",
  imageUpload.fields([{ name: "employee_excel" }]),
  (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        status: false,
        message: "Token must be provided",
      });
    }
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var workbook = XLSX.readFile(req.files.employee_excel[0].path);
    var sheet_namelist = workbook.SheetNames;
    var x = 0;
    var list = [];
    let countInfo = 0;
    sheet_namelist.forEach(async (element) => {
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
      for (let i = 0; i < xlData.length; i++) {
        console.log(xlData[i]);
        let company =await Admin.findOne({_id:company_id})
        Location.findOne({ name: xlData[i].State })
          .exec()
          .then((state_data) => {
            Location.findOne({ name: xlData[i].City })
              .exec()
              .then((city_data) => {
                Location.findOne({ name: xlData[i].District })
                  .exec()
                  .then((area_data) => {
                    Location.findOne({ name: xlData[i].Headquarter_State })
                      .exec()
                      .then((headquarter_state_data) => {
                        Location.findOne({ name: xlData[i].Headquarter_City })
                          .exec()
                          .then((headquarter_city_data) => {
                            var new_emp = new Employee({
                              employeeName: xlData[i].Employee_Name,
                              phone: xlData[i].Phone_Number,
                              email: xlData[i].Email,
                              address: xlData[i].Address,
                              employee_code:company.companyName,
                              city: city_data._id,
                              companyId: company_id,
                              image: xlData[i].Profile_Image,
                              headquarterState: headquarter_state_data._id,
                              headquarterCity: headquarter_city_data._id,
                              state: state_data._id,
                              district: area_data._id,
                              pincode: xlData[i].Pincode,
                              qualification: xlData[i].Qualification,
                              experience: xlData[i].Experience,
                              Created_date: get_current_date(),
                              Updated_date: get_current_date(),
                              status: xlData[i].Status,
                            });
                            new_emp.save();
                            list.push(new_emp);
                            countInfo++;
                            if (countInfo == xlData.length) {
                              res.status(200).json({
                                status: true,
                                message: "Data imported successfully",
                                result: list,
                              });
                            }
                          });
                      });
                  });
              });
          });
      }
      x++;
    });
  }
);

module.exports = router;
