const express = require("express");
const mongoose = require("mongoose");
const Location = mongoose.model("Location");
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

router.post('/addLocation',(req,res)=>{
    var name = req.body.name?req.body.name:"";
    var p_id = req.body.p_id?req.body.p_id:"";
    // var superp_id = req.body.superp_id?req.body.superp_id:"";
    var subp_id = req.body.subp_id?req.body.subp_id:"";
    if(name!=""){
        Location.find({$and:[{name:name},{P_id:p_id},{subP_id:subp_id}]}).exec().then(location_data=>{
            if(location_data.length<1){
                var new_location = new Location({
                    name:name,
                    P_id:p_id,
                    subP_id:subp_id,
                    // superp_id:superp_id,
                    status:"Active",
                    Created_date:get_current_date(),
                    Updated_date:get_current_date()
                });
                new_location.save().then(data=>{
                    res.status(200).json({
                        status:true,
                        message:"Location added successfully",
                        details:data
                    })
                })
            }else{
                res.json({
                    status:false,
                    message:"location already exists"
                })
            }
        })
    }else{
        res.status(401).json({
            status:false,
            message:"Name must be filled"
        })
    }

});

router.get('/getLocation',(req,res)=>{
    console.log(req.query);
    var p_id = req.query.p_id?req.query.p_id:"";
    var subp_id = req.query.subp_id?req.query.subp_id:"";
    if(p_id=="" && subp_id==""){
        Location.find({$and:[{P_id:""},{subP_id:""}]}).exec().then(state_data=>{
            res.json({
                status:true,
                message:"States get successfully",
                result:state_data
            });
        });
    }else if(p_id!="" && subp_id==""){
        Location.find({$and:[{P_id:p_id},{subP_id:""}]}).exec().then(city_data=>{
            res.json({
                status:true,
                message:"City data fetch successfully",
                result:city_data
            });
        });
    }else if(p_id!="" && subp_id!=""){
        Location.find({$and:[{P_id:p_id},{subP_id:subp_id}]}).exec().then(area_data=>{
            res.json({
                status:true,
                message:"Area data fetch successfully",
                result:area_data
            });
        });
    }
});
// router.get('/getLocation',(req,res)=>{
//     console.log(req.query);
//     var p_id = req.query.p_id?req.query.p_id:"";
//     var subp_id = req.query.subp_id?req.query.subp_id:"";
//     var superp_id = req.query.superp_id?req.query.superp_id:"";
//     let arr = []
//     if(p_id) arr.push({P_id:p_id})
//     if(subp_id) arr.push({subP_id:subp_id})
//     if(superp_id) arr.push({superp_id:superp_id})
//     let location_data = await 
//     Location.find({$and:arr}).exec().then(location_data=>{
//         res.json({
//             status:true,
//             message:"Location get successfully",
//             result:location_data
//         });
//     });
//     if(p_id=="" && subp_id==""){
//         Location.find({$and:[{P_id:""},{subP_id:""}]}).exec().then(state_data=>{
//             res.json({
//                 status:true,
//                 message:"States get successfully",
//                 result:state_data
//             });
//         });
//     }else if(p_id!="" && subp_id==""){
//         Location.find({$and:[{P_id:p_id},{subP_id:""}]}).exec().then(city_data=>{
//             res.json({
//                 status:true,
//                 message:"City data fetch successfully",
//                 result:city_data
//             });
//         });
//     }else if(p_id!="" && subp_id!=""){
//         Location.find({$and:[{P_id:p_id},{subP_id:subp_id}]}).exec().then(area_data=>{
//             res.json({
//                 status:true,
//                 message:"Area data fetch successfully",
//                 result:area_data
//             });
//         });
//     }
// });



module.exports = router;