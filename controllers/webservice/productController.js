const express = require("express");
const mongoose = require("mongoose");
const Product = mongoose.model("Product");
const Brand = mongoose.model("Brand");
const ProductCatagory = mongoose.model("ProductCatagory");
const router = express.Router();
const base_url = "https://salesparrow.teknikoglobal.com/";
const multer = require("multer");
const jwt = require('jsonwebtoken');

const imageStorage = multer.diskStorage({
  destination: "images/Product_img",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now());
  },
});

const imageUpload = multer({
  storage: imageStorage,
}).single("product_image");

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
    imageUpload(req, res, async (err) => {
        console.log("file",req.file);
        console.log("body",req.body);
        if (!req.file) return res.status(201).json({ status: true, message: "File not found"});
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) return res.json({ status: false, message: "Token is required" });
        let x = token.split(".");
        if (x.length < 3) return res.send({ status: false, message: "Invalid token" });
        var decodedToken = jwt.verify(token, "test");
        var company_id = decodedToken.user_id;
        let productName = req.body.productName?req.body.productName:"";
        let catagory_id = req.body.catagory_id?req.body.catagory_id:"";
        let sub_catagory_id = req.body.sub_catagory_id?req.body.sub_catagory_id:"";
        let description = req.body.description?req.body.description:"";
        let gst = req.body.gst?req.body.gst:"";
        let brand_id = req.body.brand_id?req.body.brand_id:"";
        if(productName=="") return res.json({status:false,message:"Product name is required"})
        if(catagory_id=="") return res.json({status:false,message:"catagory is required"})
        if(brand_id=="") return res.json({status:false,message:"Brand is required"})
        let new_product = new Product({
            catagory_id:catagory_id,
            sub_catagory_id:sub_catagory_id,
            productName:productName,
            description:description,
            company_id:company_id,
            gst:gst,
            display_image:`${base_url}_${productName.toLowerCase()}_${req.file.path}`,
            brand_id:brand_id,
            Created_date:get_current_date(),
            Updated_date:get_current_date(),
            status:"Active",
        });
        new_product.save().then(data=>{
            res.json({status:true,message:"Product added successfully",result:data})
        })
    })    
});

router.post('/edit_product',async (req,res)=>{
    imageUpload(req, res, async (err) => {
        let id = req.body.id?req.body.id:"";
        if(id=="") return res.json({status:false,message:"Please provide the id."})
        let product_data = await Product.findOne({_id:id});
        if(!product_data) return res.json({status:false,message:"Please check the id"});
        let updated_product = {};
        if(req.body.productName){
            updated_product.productName = req.body.productName;
        }
        if(req.body.description){
            updated_product.description = req.body.description;
        }
        if(req.body.gst){
            updated_product.gst = req.body.gst;
        }
        if(req.body.status){
            updated_product.status = req.body.status;
        }
        if(req.file){
            if(req.body.productName){
                updated_product.display_image = `${base_url}_${req.body.productName}_${req.file.path}`;
            }else{
                updated_product.display_image = `${base_url}_${product_data.productName}_${req.file.path}`;
            } 
        }
        updated_product.Updated_date = get_current_date();
        Product.findByIdAndUpdate({_id:id},updated_product,{new:true},(err,data)=>{
            if(data) return res.json({ status: true, message: "Updated successfully",result:updated_product});
        })
    })
});

router.post('/get_all_products',async (req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.json({ status: false, message: "Token is required" });
    let x = token.split(".");
    if (x.length < 3) return res.send({ status: false, message: "Invalid token" });
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    let catagory_id = req.body.catagory_id?req.body.catagory_id:"";
    let sub_catagory_id = req.body.catagory_id?req.body.sub_catagory_id:"";
    let brand_id = req.body.brand_id?req.body.brand_id:"";
    let arr =[];
    let limit = 10;
    let list = [];
    let page = req.body.page?req.body.page:"1";
    if(brand_id!="" && catagory_id=="" && sub_catagory_id==""){
        arr.push({company_id},{brand_id})
    }else if(brand_id!="" && catagory_id!="" && sub_catagory_id!=""){
        arr.push({company_id},{brand_id},{catagory_id},{sub_catagory_id})
    }else if(brand_id=="" && catagory_id!="" && sub_catagory_id==""){
        arr.push({company_id},{catagory_id})
    }else if(brand_id=="" && catagory_id!="" && sub_catagory_id!=""){
        arr.push({company_id},{catagory_id},{sub_catagory_id})
    }else if(brand_id=="" && catagory_id=="" && sub_catagory_id==""){
        arr.push({company_id})
    }
    let count = await Product.find({$and:arr});
    let product_data = await Product.find({$and:arr}).limit(limit*1).sort((page-1)*limit);
    if(product_data.length<1) return res.json({status:true,message:"No data",result:[]});
    let counInfo = 0;
    for(let i = 0;i<product_data.length;i++){
        await (async function (rowData) {
            let catagory_data = await ProductCatagory.findOne({_id:product_data[i].catagory_id});
            let brand_data = await Brand.findOne({_id:product_data[i].brand_id});
            if(product_data[i].sub_catagory_id){
                let sub_catagory_data = await ProductCatagory.findOne({_id:product_data[i].sub_catagory_id});
                var u_data = {
                    id: rowData._id,
                    name:rowData.productName,
                    brand_name:brand_data.name,
                    catagory_name:catagory_data.name,
                    sub_catagory_name:sub_catagory_data.name,
                    description:rowData.description,
                    gst:rowData.gst,
                    image:rowData.display_image,
                    status:rowData.status,
                };
                list.push(u_data);
            }else{
                var u_data = {
                    id: rowData._id,
                    name:rowData.productName,
                    brand_name:brand_data.name,
                    catagory_name:catagory_data.name,
                    sub_catagory_name:"",
                    description:rowData.description,
                    gst:rowData.gst,
                    image:rowData.display_image,
                    status:rowData.status,
                };
                list.push(u_data);
            }
        })(product_data[i]);
        counInfo++;
        if(counInfo==product_data.length) return res.json({status: true,message: "All Products found successfully",result: list,pageLength: Math.ceil(count.length / limit),});
    }
})

router.delete('/delete_product',(req,res)=>{
    let id = req.body.id ? req.body.id : "";
  if (id == "")
    return res.json({ status: false, message: "Please provide Id" });
  Product.deleteOne({ _id: id }).exec().then(() => {
      return res.json({ status: true, message: "Deleted successfully" });
    });
})

module.exports = router;