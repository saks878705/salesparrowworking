const express = require("express");
const mongoose = require("mongoose");
const Product = mongoose.model("Product");
const router = express.Router();
const base_url = "localhost:5000";
const multer = require("multer");

/*const imageStorage = multer.diskStorage({
  destination: "images/Product_img",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now());
  },
});

const imageUpload = multer({
  storage: imageStorage,
});*/

function get_current_date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (today = yyyy + "-" + mm + "-" + dd + " " + time);
};

router.post('/addProduct',(req,res)=>{
    var productCatagory_id = req.body.productCatagory_id?req.body.productCatagory_id:"";
    var productName = req.body.productName?req.body.productName:"";
    var tax = req.body.tax?req.body.tax:"";
    var SKU_ID = req.body.SKU_ID?req.body.SKU_ID:"";
    var HSN_Code = req.body.HSN_Code?req.body.HSN_Code:"";
    //var productImage = req.body.productImage?req.body.productImage:"";
    var pricing_details = req.body.pricing_details?req.body.pricing_details:"";
    var packing_details = req.body.packing_details?req.body.packing_details:"";
    if(productCatagory_id!=""){
        if(productName!=""){
            if(tax!=""){
                if(SKU_ID!=""){
                    if(HSN_Code!=""){
                        if(pricing_details!=""){
                            if(packing_details!=""){
                                Product.find({productName}).exec().then(product_data=>{
                                    if(product_data<1){
                                        var new_product = new Product({
                                            productCatagory_id:productCatagory_id,
                                            productName:productName,
                                            tax:tax,
                                            SKU_ID:SKU_ID,
                                            HSN_Code:HSN_Code,
                                            pricing_details:pricing_details,
                                            packing_details:packing_details,
                                            Created_date:get_current_date(),
                                            Updated_date:get_current_date(),
                                            status:"Active"
                                        });
                                        new_product.save().then(data=>{
                                            res.json({
                                                status:true,
                                                message:"Product added successfully",
                                                details:data
                                            });
                                        })
                                    }else{
                                        res.json({
                                            status:false,
                                            message:"Product already exists",
                                        });
                                    }
                                })
                            }else{
                                res.json({
                                    status:false,
                                    message:"Packing details are required"
                                });
                            }
                        }else{
                            res.json({
                                status:false,
                                message:"Pricing details are required"
                            });
                        }
                    }else{
                        res.json({
                            status:false,
                            message:"HSN Code are required"
                        });
                    }
                }else{
                    res.json({
                        status:false,
                        message:"SKU ID are required"
                    });
                }
            }else{
                res.json({
                    status:false,
                    message:"Tax are required"
                });
            }
        }else{
            res.json({
                status:false,
                message:"Product Name are required"
            });
        }
    }else{
        res.json({
            status:false,
            message:"Product Catagory Id are required"
        });
    }
});

module.exports = router;