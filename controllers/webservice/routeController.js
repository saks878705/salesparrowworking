const express = require("express");
const mongoose = require("mongoose");
const Route = mongoose.model("Route");
const router = express.Router();

function get_current_date() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (today = yyyy + "-" + mm + "-" + dd + " " + time);
};

router.post('addRoute',(req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var state = req.body.state?req.body.state:"";
    var city = req.body.city?req.body.city:"";
    var area = req.body.area?req.body.area:"";
    var start_point = req.body.start_point?req.body.start_point:"";
    var end_point = req.body.end_point?req.body.end_point:"";
    if(authHeader!=""){
        if(state!=""){
            if(city!=""){
                if(area!=""){
                    if(start_point!=""){
                        if(end_point!=""){
                            var new_route = new Route({
                                state:state,
                                city:city,
                                area:area,
                                start_point:start_point,
                                company_id:company_id,
                                end_point:end_point,
                                Created_date:get_current_date(),
                                Updated_date:get_current_date(),
                                status:"Active"
                            });
                            new_route.save().then((err,data)=>{
                                if(err){
                                    res.json({
                                        status:false,
                                        message:"Error",
                                        result:err
                                    });
                                }else{
                                    res.json({
                                        status:true,
                                        message:"Route created successfully",
                                        result:data
                                    });
                                }
                            })
                        }else{
                            res.json({
                                status:false,
                                message:"End point must be specified is required."
                            });
                        }
                    }else{
                        res.json({
                            status:false,
                            message:"Starting point  is required."
                        });
                    }
                }else{
                    res.json({
                        status:false,
                        message:"Area is required."
                    });
                }
            }else{
                res.json({
                    status:false,
                    message:"City is required."
                });
            }
        }else{
            res.json({
                status:false,
                message:"State is required."
            });
        }
    }else{
        res.json({
            status:false,
            message:"Token is required."
        });
    }
});

router.post('routeListing',(req,res)=>{

})

module.exports = router;