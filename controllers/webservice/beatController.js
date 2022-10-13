const express = require("express");
const mongoose = require("mongoose");
const Beat = mongoose.model("Beat");
const router = express.Router();

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
  var beatName = req.body.beatName ? req.body.beatName : "";
  var area = req.body.area ? req.body.area : "";
  var state = req.body.state ? req.body.state : "";
  var city = req.body.city ? req.body.city : "";
  var pincode = req.body.pincode ? req.body.pincode : "";
  var district = req.body.district ? req.body.district : "";
  if (beatName != "") {
    if (area != "") {
      if (state != "") {
        if (city != "") {
          if (pincode != "") {
            if (district != "") {
              Beat.find({ beatName: beatName })
                .exec()
                .then((beat_info) => {
                  if (beat_info.length < 1) {
                    var new_beat = new Beat({
                      beatName: beatName,
                      area: area,
                      city: city,
                      state: state,
                      district: district,
                      pincode: pincode,
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
                    message: "District is required",
                    results: null,
                  });
            }
          } else {
            return res.json({
                status: false,
                message: "Pincode is required",
                results: null,
              });
          }
        } else {
          return res.json({
            status: false,
            message: "City is required",
            results: null,
          });
        }
      } else {
        return res.json({
          status: false,
          message: "State is required",
          results: null,
        });
      }
    } else {
      return res.json({
        status: false,
        message: "Area is required",
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
                  if (req.body.area) {
                    updated_beat.area = req.body.area;
                  }
                  if (req.body.city) {
                    updated_beat.city = req.body.city;
                  }
                  if (req.body.state) {
                    updated_beat.state = req.body.state;
                  }
                  if (req.body.pincode) {
                    updated_beat.pincode = req.body.pincode;
                  }
                  if (req.body.district) {
                    updated_beat.district = req.body.district;
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
                    message: "Employee not found.",
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
  var page = req.body.page?req.body.page:"1";
  var limit = 5;
  var count =await Beat.find();
    Beat.find().limit( limit * 1).skip((page -1) * limit).exec().then(beat_data=>{
        res.json({
            status:true,
            message:"All Beats found successfully",
            result:beat_data,
            pageLength:Math.ceil(count.length/limit)
        })
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
