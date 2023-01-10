const express = require("express");
const mongoose = require("mongoose");
const Employee = mongoose.model("Employee");
const VoucherGoodsReturn = mongoose.model("VoucherGoodsReturn");
const router = express.Router();
const base_url = "https://salesparrow.teknikoglobal.com/";
const multer = require("multer");
const jwt = require("jsonwebtoken");

const imageStorage = multer.diskStorage({
    destination: "images/voucher_img",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now());
    },
  });
  
  const imageUpload = multer({
    storage: imageStorage,
  }).single("voucher_img");

function get_current_date() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (today = yyyy + "-" + mm + "-" + dd + " " + time);
}

router.post('/create_voucher',(req,res)=>{
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
        var employee_id = decodedToken.user_id;
        let party_type_id = req.body.party_type_id?req.body.party_type_id:"";
        let party_id = req.body.party_id?req.body.party_id:"";
        let total_qty = req.body.total_qty?req.body.total_qty:"";
        let total_amount = req.body.total_amount?req.body.total_amount:"";
        let net_amount = req.body.net_amount?req.body.net_amount:"";
        let depriciation = req.body.depriciation?req.body.depriciation:"";
        let description = req.body.description?req.body.description:"";
        if(party_id=="") return res.json({status:false,message:"Provide Party "})
        if(total_qty=="") return res.json({status:false,message:"Provide total quantity"})
        if(total_amount=="") return res.json({status:false,message:"Provide total amount"})
        let new_voucher = await VoucherGoodsReturn.create({
            emp_id:employee_id,
            party_type_id:party_type_id,
            party_id:party_id,
            total_amount:total_amount,
            net_amount:net_amount,
            total_qty:total_qty,
            depriciation:depriciation,
            description:description,
            photo:`${base_url}${req.file.path}`,
            Created_date:get_current_date(),
            Updated_date:get_current_date(),
            status:"Active",
        })
        return res.json({status:true,message:"Voucher created",result:new_voucher})
    })
});

module.exports = router;