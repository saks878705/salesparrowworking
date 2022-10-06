const express = require("express");
const mongoose = require("mongoose");
const Banner = mongoose.model("Banner");
const router = express.Router();
const base_url = "localhost:5000";
const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: "images/Banner",
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

router.post('/addBanner',imageUpload.fields([{name:"Banner"}]),(req,res)=>{
    var bannerType = req.body.bannerType?req.body.bannerType:"";
    var bannerName = req.body.bannerName?req.body.bannerName:"";
    var date = req.body.date?req.body.date:"";
    if(bannerType!=""){
        if(bannerName!=""){
            if(bannerType=="Personal Occassions"){
                var new_banner = new Banner({
                    bannerType:bannerType,
                    bannerName:bannerName,
                    poster:base_url + req.files.Banner[0].path,
                    status:"Active",
                    Created_date:get_current_date(),
                    Updated_date:get_current_date(),
                });
                new_banner.save().then(data=>{
                    res.status(200).json({
                        status:true,
                        message:"Banner added successfully",
                        result:data
                    });
                })
            }else if(bannerType=="Festival Occassions"){
                if(date!=""){
                    var new_banner = new Banner({
                        bannerType:bannerType,
                        bannerName:bannerName,
                        poster:base_url + req.files.Banner[0].path,
                        date:date,
                        status:"Active",
                        Created_date:get_current_date(),
                        Updated_date:get_current_date(),
                    });
                    new_banner.save().then(data=>{
                        res.status(200).json({
                            status:true,
                            message:"Banner added successfully",
                            result:data
                        });
                    })
                }else{
                    res.json({
                        status:false,
                        message:"Date is required"
                    });
                }
            }
        }else{
            res.json({
                status:false,
                message:"Banner Name is required"
            });
        }
    }else{
        res.json({
            status:false,
            message:"Banner Type is required"
        });
    }
});

router.get('/getBanner',(req,res)=>{
    Banner.find().exec().then(data=>{
        res.json({
            status:true,
            message:"Banner get successfully",
            result:data
        });
    })
})

module.exports = router;