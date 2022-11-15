const express = require("express");
const mongoose = require("mongoose");
const Party = mongoose.model("Party");
const Location = mongoose.model("Location");
const Route = mongoose.model("Route");
const router = express.Router();
const jwt = require("jsonwebtoken");
const base_url = "http://salesparrow.herokuapp.com/";
const multer = require("multer");
const XLSX = require("xlsx");
const { Router } = require("express");

const imageStorage = multer.diskStorage({
  destination: "images/party_image",
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

router.post("/addParty",imageUpload.fields([{ name: "Party_image" }]),(req, res) => {
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
    var company_id = decodedToken.user_id;
    var partyType = req.body.partyType ? req.body.partyType : "";
    var firmName = req.body.firmName ? req.body.firmName : "";
    var GSTNo = req.body.GSTNo ? req.body.GSTNo : null;
    var contactPersonName = req.body.contactPersonName
      ? req.body.contactPersonName
      : "";
    var mobileNo = req.body.mobileNo ? req.body.mobileNo : "";
    var email = req.body.email ? req.body.email : "";
    var pincode = req.body.pincode ? req.body.pincode : "";
    var state = req.body.state ? req.body.state : "";
    var city = req.body.city ? req.body.city : "";
    var district = req.body.district ? req.body.district : "";
    var address = req.body.address ? req.body.address : "";
    var DOB = req.body.DOB ? req.body.DOB : "";
    var DOA = req.body.DOA ? req.body.DOA : "";
    var route = req.body.route ? req.body.route : "";
    if (partyType != "") {
      if (firmName != "") {
        if (mobileNo != "") {
          if (pincode != "") {
            if (city != "") {
              if (state != "") {
                if (district != "") {
                  if (address != "") {
                    var new_party = new Party({
                      partyType: partyType,
                      firmName: firmName,
                      GSTNo: GSTNo,
                      image: base_url + req.files.Party_image[0].path,
                      contactPersonName: contactPersonName,
                      mobileNo: mobileNo,
                      email: email,
                      company_id: company_id,
                      pincode: pincode,
                      state: state,
                      route: route,
                      city: city,
                      district: district,
                      address: address,
                      DOB: DOB,
                      DOA: DOA,
                      Created_date: get_current_date(),
                      Updated_date: get_current_date(),
                      status: "Active",
                    });
                    new_party.save().then((data) => {
                      console.log(route)
                      console.log(route[0])
                      var arr = route?route.split(","): "";
                      console.log(arr)
                      if(arr==""){
                        res.status(200).json({
                          status: true,
                          message: "Party created successfully",
                          result: data,
                        });
                      }else{
                        let count = 0;
                        for(let i = 0;i<arr.length;i++){
                          Route.updateOne({_id:arr[i]},{$set:{is_assigned:"1",assigned_to:data._id}}).exec().then(route_data=>{
                            count++;
                            if(count==arr.length){
                              res.status(200).json({
                                status: true,
                                message: "Party created successfully",
                                result: data,
                              });
                            }
                          })
                        }
                      }
                      
                    });
                  } else {
                    res.json({
                      status: false,
                      message: "address is required",
                    });
                  }
                } else {
                  res.json({
                    status: false,
                    message: "district is required",
                  });
                }
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
  }
);

router.post("/editParty", (req, res) => {
  console.log(req.body);
  var route = req.body.route?req.body.route:""
  var id = req.body.id ? req.body.id : "";
  Party.find({ _id: id })
    .exec()
    .then((party_data) => {
      if (party_data.length > 0) {
        var updated_party = {};
        if (req.body.partyType) {
          updated_party.partyType = req.body.partyType;
        }
        if (req.body.firmName) {
          updated_party.firmName = req.body.firmName;
        }
        updated_party.route = req.body.route;

        if (req.body.GSTNo) {
          updated_party.GSTNo = req.body.GSTNo;
        }
        if (req.body.mobileNo) {
          updated_party.mobileNo = req.body.mobileNo;
        }
        if (req.body.pincode) {
          updated_party.pincode = req.body.pincode;
        }
        if (req.body.city) {
          updated_party.city = req.body.city;
        }
        if (req.body.state) {
          updated_party.state = req.body.state;
        }
        if (req.body.DOB) {
          updated_party.DOB = req.body.DOB;
        }
        if (req.body.district) {
          updated_party.district = req.body.district;
        }
        if (req.body.DOA) {
          updated_party.DOA = req.body.DOA;
        }
        if (req.body.email) {
          updated_party.email = req.body.email;
        }
        if (req.body.contactPersonName) {
          updated_party.contactPersonName = req.body.contactPersonName;
        }
        if (req.body.address) {
          updated_party.address = req.body.address;
        }
        if (req.body.status) {
          updated_party.status = req.body.status;
        }
        updated_party.Updated_date = get_current_date();
        Party.findOneAndUpdate({ _id: id },updated_party,{ new: true },(err, doc) => {
            if (doc) {
              var arr = route?route.split(","): "";
                      if(arr==""){
                        res.status(200).json({
                          status: true,
                          message: "Update successfully",
                          results: updated_party,
                        });
                      }else{
                        let count = 0;
                        for(let i = 0;i<arr.length;i++){
                          Route.updateOne({_id:arr[i]},{$set:{is_assigned:"1",assigned_to:data._id}}).exec().then(route_data=>{
                            count++;
                            if(count==arr.length){
                              res.status(200).json({
                                status: true,
                                message: "Update successfully",
                                results: updated_party,
                              });
                            }
                          })
                        }
                      }
              
            }
          }
        );
      } else {
        res.json({
          status: false,
          message: "Party not exist",
        });
      }
    });
});

router.post("/getAllParty", async (req, res) => {
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
  var page = req.body.page ? req.body.page : "1";
  var limit = 10;
  var count = await Party.find({ company_id });
  var list = [];
  var list2 = [];
  var state = req.body.state ? req.body.state : "";
  var partyType = req.body.partyType ? req.body.partyType : "";
  let obj1 = [];
  if (company_id != "" && state == "" && partyType == "") {
    obj1 = [{ company_id }];
  } else if (company_id != "" && state != "" && partyType == "") {
    obj1 = [{ company_id }, { state }];
  } else if (company_id != "" && state == "" && partyType != "") {
    obj1 = [{ company_id }, { partyType }];
  } else if (company_id != "" && state != "" && partyType != "") {
    obj1 = [{ company_id }, { state }, { partyType }];
  }
  Party.find({ $and: obj1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()
    .then((party_data) => {
      console.log("party_data", party_data);
      if (party_data.length > 0) {
        let counInfo = 0;
        for (let i = 0; i < party_data.length; i++) {
          Location.findOne({ _id: party_data[i].state })
            .exec()
            .then((state_data) => {
              Location.findOne({ _id: party_data[i].city })
                .exec()
                .then((city_data) => {
                  Location.findOne({ _id: party_data[i].district })
                    .exec()
                    .then((district_data) => {
                      var arr = party_data[i].route? party_data[i].route[0].split(","): "";
                      if (arr == "") {
                        (async function (rowData) {
                          var u_data = {
                            id: rowData._id,
                            state: { name: state_data.name, id: rowData.state },
                            city: { name: city_data.name, id: rowData.city },
                            district: {
                              name: district_data.name,
                              id: rowData.district,
                            },
                            firmName: rowData.firmName,
                            partyType: rowData.partyType,
                            image: rowData.image,
                            pincode: rowData.pincode,
                            GSTNo: rowData.GSTNo,
                            contactPersonName: rowData.contactPersonName,
                            mobileNo: rowData.mobileNo,
                            email: rowData.email,
                            DOB: rowData.DOB,
                            DOA: rowData.DOA,
                            route: list2,
                            areas: rowData.address,
                            status: rowData.status,
                          };
                          list.push(u_data);
                        })(party_data[i]);
                        counInfo++;
                        if (counInfo == party_data.length) {
                          let c = Math.ceil(count.length / limit);
                          console.log(count.length);
                          console.log(c);
                          if (c == 0) {
                            c += 1;
                          }
                          res.json({
                            status: true,
                            message:
                              "Parties for this state found successfully",
                            result: list,
                            pageLength: c,
                          });
                        }
                      } else {
                        console.log("inside else");
                        for (let j = 0; j < arr.length; j++) {
                          console.log(j);
                          console.log(arr[j]);
                          Route.findOne({ _id: arr[j] })
                            .exec()
                            .then(async (route_data) => {
                              console.log("routedata", route_data);
                              let data = {
                                start_point: route_data.start_point,
                                end_point: route_data.end_point,
                                id: route_data._id,
                              };
                              list2.push(data);
                              console.log(list2);
                              if (arr.length == j + 1) {
                                console.log("ye kitti baar chala");
                                console.log(
                                  "party_data near rowData>>>>>",
                                  party_data[i]
                                );
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
                                    district: {
                                      name: district_data.name,
                                      id: rowData.district,
                                    },
                                    firmName: rowData.firmName,
                                    partyType: rowData.partyType,
                                    pincode: rowData.pincode,
                                    image: rowData.image,
                                    GSTNo: rowData.GSTNo,
                                    contactPersonName:
                                      rowData.contactPersonName,
                                    mobileNo: rowData.mobileNo,
                                    email: rowData.email,
                                    DOB: rowData.DOB,
                                    DOA: rowData.DOA,
                                    route: list2,
                                    areas: rowData.address,
                                    status: rowData.status,
                                  };
                                  list.push(u_data);
                                  list2 = [];
                                })(party_data[i]);
                                counInfo++;
                                if (counInfo == party_data.length) {
                                  let c = Math.ceil(count.length / limit);
                                  if (c == 0) {
                                    c += 1;
                                  }
                                  res.json({
                                    status: true,
                                    message:
                                      "Parties for this state found successfully",
                                    result: list,
                                    pageLength: c,
                                  });
                                }
                              }
                            });
                        }
                      }
                    });
                });
            });
        }
      } else {
        res.json({
          status: true,
          message: "No party found",
          result: [],
        });
      }
    });
});

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
                  Location.findOne({ _id: party_data.district })
                    .exec()
                    .then((district_data) => {
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
                          district: {
                            name: district_data.name,
                            id: party_data.district,
                          },
                          firmName: party_data.firmName,
                          address: party_data.address,
                          partyType: party_data.partyType,
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
                                start_point: route_data.start_point,
                                end_point: route_data.end_point,
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
                                  district: {
                                    name: district_data.name,
                                    id: party_data.district,
                                  },
                                  firmName: party_data.firmName,
                                  address: party_data.address,
                                  partyType: party_data.partyType,
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

router.post("/partyProfileImage",imageUpload.fields([{ name: "party_image" }]),(req, res) => {
    console.log(req.body);
    const id = req.body.id ? req.body.id : "";
    if (id != "") {
      Party.findOne({ _id: id })
        .exec()
        .then((user_data) => {
          if (user_data) {
            updated_party = {};
            if (req.files.party_image) {
              updated_party.image = base_url + req.files.party_image[0].path;
            }
            Party.findOneAndUpdate(
              { _id: id },
              updated_party,
              { new: true },
              (err, doc) => {
                if (doc) {
                  res.status(200).json({
                    status: true,
                    message: "Updated Successfully",
                    result: updated_party,
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

router.delete("/deleteParty", (req, res) => {
  var id = req.body.id ? req.body.id : "";
  if (id != "") {
    Party.findOne({ _id: id }).exec().then((party_data) => {
      var arr = party_data.route?party_data.route[0].split(","): "";
      if(arr==""){
        Party.findOneAndDelete({ _id: id }).exec().then(() => {
          res.status(200).json({
            status: true,
            message: "Deleted successfully",
          });
        });
      }else{
        let count = 0;
        for(let i = 0;i<arr.length;i++){
          Route.updateOne({_id:arr[i]},{$set:{is_assigned:"1",assigned_to:data._id}}).exec().then(route_data=>{
            count++;
            if(count==arr.length){
              Party.findOneAndDelete({ _id: id }).exec().then(() => {
                res.status(200).json({
                  status: true,
                  message: "Deleted successfully",
                });
              });
            }
          })
        }      
      }
      
      });
      
  }
});

router.post("/bulkImport",imageUpload.fields([{ name: "party_excel" }]),(req, res) => {
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
    var workbook = XLSX.readFile(req.files.party_excel[0].path);
    var sheet_namelist = workbook.SheetNames;
    var x = 0;
    var list = [];
    let countInfo = 0;
    sheet_namelist.forEach((element) => {
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
      for (let i = 0; i < xlData.length; i++) {
        console.log(xlData[i]);
        Location.findOne({ name: xlData[i].State })
          .exec()
          .then((state_data) => {
            Location.findOne({ name: xlData[i].City })
              .exec()
              .then((city_data) => {
                Location.findOne({ name: xlData[i].District })
                  .exec()
                  .then((area_data) => {
                    var new_party = new Party({
                      partyType: xlData[i].Party_Type,
                      firmName: xlData[i].Firm_Name,
                      GSTNo: xlData[i].GST_No,
                      route:"",
                      image: xlData[i].Profile_Image,
                      contactPersonName: xlData[i].Contact_Person_Name,
                      mobileNo: xlData[i].Phone_Number,
                      email: xlData[i].Email,
                      company_id: company_id,
                      pincode: xlData[i].Pincode,
                      state: state_data._id,
                      city: city_data._id,
                      district: area_data._id,
                      address: xlData[i].Address,
                      DOB: xlData[i].DOB,
                      DOA: xlData[i].DOA,
                      Created_date: get_current_date(),
                      Updated_date: get_current_date(),
                      status: xlData[i].Status,
                    });
                    new_party.save();
                    list.push(new_party);
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
      }

      x++;
    });
  }
);
module.exports = router;
