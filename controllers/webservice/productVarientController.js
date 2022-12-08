const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProductVarient = mongoose.model("ProductVarient");
const Product = mongoose.model("Product");
const base_url = "https://salesparrow.teknikoglobal.com/";
const multer = require("multer");
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

function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans += 
          arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

const imageStorage = multer.diskStorage({
  destination: "images/product_varient_image",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now());
  },
});

const imageUpload = multer({
  storage: imageStorage,
}).single("product_varient_image");

router.post('/add_product_varient',(req,res)=>{
    imageUpload(req, res, async (err) => {
        if (!req.file) return res.status(201).json({ status: true, message: "File not found"});
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) return res.json({ status: false, message: "Token is required" });
        let x = token.split(".");
        if (x.length < 3) return res.send({ status: false, message: "Invalid token" });
        var decodedToken = jwt.verify(token, "test");
        var company_id = decodedToken.user_id;
        let product_id = req.body.product_id?req.body.product_id:"";
        let varient_name = req.body.varient_name?req.body.varient_name:"";
        let mrp = req.body.mrp?req.body.mrp:"";
        let price = req.body.price?req.body.price:"";
        let sku_id = req.body.sku_id?req.body.sku_id:"";
        let packing_details = req.body.packing_details?req.body.packing_details:null;
        if(product_id=="") return res.json({status:false,message:"Product name is required"})
        if(varient_name=="") return res.json({status:false,message:"Varient name is required"})
        if(mrp=="") return res.json({status:false,message:"Mrp is required"});
        let new_product_varient = new ProductVarient({
            product_id:product_id,
            mrp:mrp,
            price:price,
            varient_name:varient_name,
            packing_details:packing_details,
            //sku_id:randomStr(8,'123456789abcdefghijklmnopqrstufwxyz'),
            sku_id:sku_id,
            company_id:company_id,
            display_image:`${base_url}${req.file.path}`,
            Created_date:get_current_date(),
            Updated_date:get_current_date(),
            status:"Active",
        });
        new_product_varient.save().then(data=>{
            res.json({status:true,message:"Product varient added successfully",result:data})
        })
    }) 
})

router.post('/edit_product_varient',async (req,res)=>{
    imageUpload(req, res, async (err) => {
        let id = req.body.id?req.body.id:"";
        if(id=="") return res.json({status:false,message:"Please provide the id."})
        let product_varient_data = await ProductVarient.findOne({_id:id});
        if(!product_varient_data) return res.json({status:false,message:"Please check the id"});
        let updated_product_varient = {};
        if(req.body.product_id){
            updated_product_varient.product_id = req.body.product_id;
        }
        if(req.body.mrp){
            updated_product_varient.mrp = req.body.mrp;
        }
        if(req.body.packing_details){
            updated_product_varient.packing_details = req.body.packing_details;
        }
        if(req.body.price){
            updated_product_varient.price = req.body.price;
        }
        if(req.body.sku_id){
            updated_product_varient.sku_id = req.body.sku_id;
        }
        if(req.body.status){
            updated_product_varient.status = req.body.status;
        }
        if(req.body.varient_name){
            updated_product_varient.varient_name = req.body.varient_name;
        }
        if(req.file){
            updated_product_varient.display_image = `${base_url}${req.file.path}`; 
        }
        updated_product_varient.Updated_date = get_current_date();
        ProductVarient.findByIdAndUpdate({_id:id},updated_product_varient,{new:true},(err,data)=>{
            if(data) return res.json({ status: true, message: "Updated successfully",result:updated_product_varient});
        })
    })
});

router.post('/get_all_product_varients',async (req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.json({ status: false, message: "Token is required" });
    let x = token.split(".");
    if (x.length < 3) return res.send({ status: false, message: "Invalid token" });
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    let product_id = req.body.product_id?req.body.product_id:"";
    let arr =[];
    let limit = 10;
    let list = [];
    let page = req.body.page?req.body.page:"1";
    if(product_id!=""){
        arr.push({company_id},{product_id},{is_delete:"0"})
    }else{
        arr.push({company_id},{is_delete:"0"})
    }
    let count = await ProductVarient.find({$and:arr});
    let product_varient_data = await ProductVarient.find({$and:arr}).limit(limit*1).sort((page-1)*limit);
    if(product_varient_data.length<1) return res.json({status:true,message:"No data",result:[]});
    let counInfo = 0;
    for(let i = 0;i<product_varient_data.length;i++){
        await (async function (rowData) {
            let product_data = await Product.findOne({_id:product_varient_data[i].product_id});
            var u_data = {
                id: rowData._id,
                varient_name:rowData.varient_name,
                product_name:product_data.productName,
                mrp:rowData.mrp,
                packing_details:rowData.packing_details,
                sku_id:rowData.sku_id,
                price:rowData.price,
                image:rowData.display_image,
                status:rowData.status,
            };
            list.push(u_data);
        })(product_varient_data[i]);
        counInfo++;
        if (counInfo == product_varient_data.length) return res.json({status: true,message: "All Products found successfully",result: list,pageLength: Math.ceil(count.length / limit),});
    }
})

router.delete('/delete_product_varient',(req,res)=>{
    let id = req.body.id ? req.body.id : "";
  if (id == "")
    return res.json({ status: false, message: "Please provide Id" });
  ProductVarient.findOneAndUpdate({ _id: id },{$set:{is_delete:"1"}}).exec().then(() => {
      return res.json({ status: true, message: "Deleted successfully" });
    });
});

module.exports = router;