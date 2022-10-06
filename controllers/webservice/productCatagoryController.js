const express = require("express");
const mongoose = require("mongoose");
const ProductCatagory = mongoose.model("ProductCatagory");
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

router.post('/addProductCatagory',(req,res)=>{
    var productCatagory = req.body.productCatagory?req.body.productCatagory:"";
    if(productCatagory!=""){
        ProductCatagory.find({productCatagory}).exec().then(product_catagory_data=>{
            if(product_catagory_data.length<1){
                var new_product_catagory = new ProductCatagory({
                    productCatagory:productCatagory,
                    Created_date:get_current_date(),
                    Updated_date:get_current_date(),
                    status:"Active"
                });
                new_product_catagory.save().then(data=>{
                    res.status(200).json({
                        status:true,
                        message:"Product Catagory added successfully",
                        details:data
                    })
                })
            }else{
                res.json({
                    status:false,
                    message:"Product catagory already exists",
                });
            }
        });
    }else{
        res.json({
            status:false,
            message:"Product catagory field is required",
        });
    }
});

router.patch('/editProductCatagory',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    if(id!=""){
        ProductCatagory.find({_id:id}).exec().then(unit_data=>{
            var updated_product_catagory = {};
            if(req.body.productCatagory){
                updated_product_catagory.productCatagory = req.body.productCatagory;
            }
            if(req.body.status){
                updated_product_catagory.status = req.body.status;
            }
            updated_product_catagory.Updated_date = get_current_date();
            ProductCatagory.findOneAndUpdate({_id:id},updated_product_catagory,{new:true},(err,doc)=>{
                if(doc){
                    res.status(200).json({
                        status:true,
                        message:"Updated successfully",
                        details:updated_product_catagory
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

router.get('/getProductCatagory',(req,res)=>{
    ProductCatagory.find().exec().then(product_catagory_data=>{
        res.status(200).json({
            status:true,
            message:"Get all Product catagory",
            result:product_catagory_data
        })
    })
});

module.exports = router;