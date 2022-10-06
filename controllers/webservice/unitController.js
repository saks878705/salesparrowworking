const express = require("express");
const mongoose = require("mongoose");
const Unit = mongoose.model("Unit");
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

router.post('/addUnit',(req,res)=>{
    var productUnit = req.body.productUnit?req.body.productUnit:"";
    if(productUnit!=""){
        Unit.find({productUnit}).exec().then(unit_data=>{
            if(unit_data.length<1){
                var new_unit = new Unit({
                    productUnit:productUnit,
                    Created_date:get_current_date(),
                    Updated_date:get_current_date(),
                    status:"Active"
                });
                new_unit.save().then(data=>{
                    res.status(200).json({
                        status:true,
                        message:"Unit added successfully",
                        details:data
                    })
                })
            }else{
                res.json({
                    status:false,
                    message:"Unit already exists",
                });
            }
        });
    }else{
        res.json({
            status:false,
            message:"Product unit field is required",
        });
    }
});

router.patch('/editUnit',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    if(id!=""){
        Unit.find({_id:id}).exec().then(unit_data=>{
            var updated_unit = {};
            if(req.body.productUnit){
                updated_unit.productUnit = req.body.productUnit;
            }
            if(req.body.status){
                updated_unit.status = req.body.status;
            }
            updated_unit.Updated_date = get_current_date();
            Unit.findOneAndUpdate({_id:id},updated_unit,{new:true},(err,doc)=>{
                if(doc){
                    res.status(200).json({
                        status:true,
                        message:"Updated successfully",
                        details:updated_unit
                    });
                }else{
                    res.json({
                        status:false,
                        message:"Error occured during updation",
                        details:err
                    });
                }
            })
        })
    }else{
        res.json({
            status:false,
            message:"Id is required",
        });
    }
});

router.get('/getUnit',(req,res)=>{
    Unit.find().exec().then(unit_data=>{
        res.status(200).json({
            status:true,
            message:"Get all Units",
            result:unit_data
        })
    })
});

module.exports = router;