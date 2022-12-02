const express = require("express");
const mongoose = require("mongoose");
const Route = mongoose.model("Route");
const Location = mongoose.model("Location");
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

router.post("/addRoute", (req, res) => {
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
  var state = req.body.state ? req.body.state : "";
  var distance = req.body.distance ? req.body.distance : "";
  var city = req.body.city ? req.body.city : "";
  var area = req.body.area ? req.body.area : "";
  var start_point = req.body.start_point ? req.body.start_point : "";
  var end_point = req.body.end_point ? req.body.end_point : "";
  if (authHeader != "") {
    if (state != "") {
      if (city != "") {
        if (area != "") {
          if (start_point != "") {
            if (end_point != "") {
              var new_route = new Route({
                state: state,
                city: city,
                area: area,
                distance: distance,
                start_point: start_point,
                company_id: company_id,
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
        } else {
          res.json({
            status: false,
            message: "Area is required.",
          });
        }
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
  } else {
    res.json({
      status: false,
      message: "Token is required.",
    });
  }
});

// router.post("/routeListing", async (req, res) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   var decodedToken = jwt.verify(token, "test");
//   var company_id = decodedToken.user_id;
//   var state = req.body.state ? req.body.state : "";
//   var city = req.body.city ? req.body.city : "";
//   // var area = req.body.area ? req.body.area : "";
//   var count = await Route.find({ company_id });
//   var limit = 10;
//   if (state != "" && city =="") {
//         var list = [];
//         Route.find({ $and: [{ company_id }, { state }] })
//           .exec()
//           .then((route_data) => {
//             if(route_data.length>0){
//               let counInfo = 0;
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
//                               state:{name:state_data.name,id:rowData.state},
//                               city:{name:city_data.name,id:rowData.city},
//                               area:{name:area_data.name,id:rowData.area},
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
//             }else{
//               res.json({
//                 status:false,
//                 message:"No route found for this state",
//                 result:[]
//               })
//             }
//           });
//   } else if(state!="" && city!=""){
//     var list = [];
//         Route.find({ $and: [{ company_id }, { state } , {city}] }).exec().then((route_data) => {
//             if(route_data.length>0){
//               let counInfo = 0;
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
//                               state:{name:state_data.name,id:rowData.state},
//                               city:{name:city_data.name,id:rowData.city},
//                               area:{name:area_data.name,id:rowData.area},
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
//             }else{
//               res.json({
//                 status:false,
//                 message:"No route found for this state",
//                 result:[]
//               })
//             }
//           });
//   }else {
//     var list = [];
//     Route.find({ company_id })
//       .exec()
//       .then((route_data) => {
//         if(route_data.length>0){
//           let counInfo = 0;
//         for (let i = 0; i < route_data.length; i++) {
//           Location.findOne({ _id: route_data[i].state })
//             .exec()
//             .then((state_data) => {
//               Location.findOne({ _id: route_data[i].city })
//                 .exec()
//                 .then((city_data) => {
//                   Location.findOne({ _id: route_data[i].area })
//                     .exec()
//                     .then(async (area_data) => {
//                       await (async function (rowData) {
//                         var u_data = {
//                           id: rowData._id,
//                           state:{name:state_data.name,id:rowData.state},
//                           city:{name:city_data.name,id:rowData.city},
//                           area:{name:area_data.name,id:rowData.area},
//                           start_point: rowData.start_point,
//                           distance: rowData.distance,
//                           end_point: rowData.end_point,
//                         };
//                         list.push(u_data);
//                       })(route_data[i]);
//                       counInfo++;
//                       if (counInfo == route_data.length) {
//                         res.json({
//                           status: true,
//                           message: "All Routes found successfully",
//                           result: list,
//                           pageLength: Math.ceil(count.length / limit),
//                         });
//                       }
//                     });
//                 });
//             });
//         }
//         }else{
//           res.json({
//             status:false,
//             message:"No route found ",
//             result:[]
//           })
//         }
//       });
//   }
// });

router.post("/routeListing", async (req, res) => {
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
  var state = req.body.state ? req.body.state : "";
  var city = req.body.city ? req.body.city : "";
  var limit = 10;
  let arr = [];
  if (company_id != "" && state == "" && city == "") {
    arr = [{ company_id }];
  } else if (company_id != "" && state != "" && city == "") {
    arr = [{ company_id }, { state }];
  } else if (company_id != "" && state != "" && city != "") {
    arr = [{ company_id }, { state }, { city }];
  }
  var count = await Route.find({ $and:arr });
  var list = [];
        Route.find({$and:arr}).exec().then((route_data) => {
            if(route_data.length>0){
              let counInfo = 0;
            for (let i = 0; i < route_data.length; i++) {
              Location.findOne({ _id: route_data[i].state }).exec().then((state_data) => {
                  Location.findOne({ _id: route_data[i].city }).exec().then((city_data) => {
                      Location.findOne({ _id: route_data[i].area }).exec().then(async (area_data) => {
                          await (async function (rowData) {
                            var u_data = {
                              id: rowData._id,
                              state:{name:state_data.name,id:rowData.state},
                              city:{name:city_data.name,id:rowData.city},
                              area:{name:area_data.name,id:rowData.area},
                              start_point: rowData.start_point,
                              distance: rowData.distance,
                              end_point: rowData.end_point,
                              status: rowData.status,
                            };
                            list.push(u_data);
                          })(route_data[i]);
                          counInfo++;
                          if (counInfo == route_data.length) {
                            res.json({
                              status: true,
                              message: "All Routes found successfully",
                              result: list,
                              pageLength: Math.ceil(count.length / limit),
                            });
                          }
                        });
                    });
                });
            }
            }else{
              res.json({
                status:true,
                message:"No route found  ",
                result:[]
              })
            }
          });
});

// router.post("/notAssignedRouteListing", async (req, res) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
//     return res.json({
//       status: false,
//       message: "Token must be provided",
//     });
//   }
//   var state = req.body.state ? req.body.state : "";
//   var city = req.body.city ? req.body.city : "";
//   var decodedToken = jwt.verify(token, "test");
//   var company_id = decodedToken.user_id;
//   var list = [];
//   let arr = [];
//   if (company_id != "" && state == "" && city == "") {
//     arr = [{ company_id },{is_assigned:"0"}];
//   } else if (company_id != "" && state != "" && city == "") {
//     arr = [{ company_id }, { state },{is_assigned:"0"}];
//   } else if (company_id != "" && state != "" && city != "") {
//     arr = [{ company_id }, { state }, { city },{is_assigned:"0"}];
//   }
//         Route.find({ $and:arr }).exec().then((route_data) => {
//             if(route_data.length>0){
//               let counInfo = 0;
//             for (let i = 0; i < route_data.length; i++) {
//                 Location.findOne({ _id: route_data[i].state }).exec().then((state_data) => {
//                   Location.findOne({ _id: route_data[i].city }).exec().then((city_data) => {
//                       Location.findOne({ _id: route_data[i].area }).exec().then(async (area_data) => {
//                           await (async function (rowData) {
//                             var u_data = {
//                               id: rowData._id,
//                               state:{name:state_data.name,id:rowData.state},
//                               city:{name:city_data.name,id:rowData.city},
//                               area:{name:area_data.name,id:rowData.area},
//                               start_point: rowData.start_point,
//                               distance: rowData.distance,
//                               end_point: rowData.end_point,
//                               status: rowData.status,
//                             };
//                             list.push(u_data);
//                           })(route_data[i]);
//                           counInfo++;
//                           if (counInfo == route_data.length) {
//                             res.json({
//                               status: true,
//                               message: "All Routes found successfully",
//                               result: list,
//                             });
//                           }
//                         });
//                     });
//                 });
//             }
//             }else{
//               res.json({
//                 status:true,
//                 message:"No route found ",
//                 result:[]
//               })
//             }
//           });
// });

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
    if (req.body.area) {
      updated_route.area = req.body.area;
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
    if (req.body.status) {
      updated_route.status = req.body.status;
    }
    Route.findOneAndUpdate({_id:id},updated_route,{new:true},(err,doc)=>{
        if(doc){
            res.json({
                status:true,
                message:"Route updated successfully",
                result:updated_route
            })
        }else{
            res.json({
                status:false,
                message:"Error",
                result:err
            })
        }
    })
  } else {
    res.json({
      status: false,
      message: "Id is required.",
    });
  }
});

router.delete("/deleteRoute", (req, res) => {
  var id = req.body.id ? req.body.id : "";
  Route.deleteOne({ _id: id })
    .exec()
    .then(() => {
      res.json({
        status: true,
        message: "Deleted successfully",
      });
    });
});

module.exports = router;
