const express = require("express");
const mongoose = require("mongoose");
const Party = mongoose.model("Party");
const router = express.Router();
const base_url = "http://salesparrow.herokuapp.com/";
const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: "images/party_image",
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

router.post('/addParty',imageUpload.fields([{name:"Party_image"}]),(req,res)=>{
    var partyType = req.body.partyType?req.body.partyType:"";
    var firmName = req.body.firmName?req.body.firmName:"";
    var GSTNo = req.body.GSTNo?req.body.GSTNo:"";
    var contactPersonName = req.body.contactPersonName?req.body.contactPersonName:"";
    var mobileNo = req.body.mobileNo?req.body.mobileNo:"";
    var email = req.body.email?req.body.email:"";
    var pincode = req.body.pincode?req.body.pincode:"";
    var state = req.body.state?req.body.state:"";
    var city = req.body.city?req.body.city:"";
    var district = req.body.district?req.body.district:"";
    var address = req.body.address?req.body.address:"";
    var DOB = req.body.DOB?req.body.DOB:"";
    var DOA = req.body.DOA?req.body.DOA:"";
    if(partyType!=""){
        if(firmName!=""){
            if(mobileNo!=""){
                if(pincode!=""){
                    if(city!=""){
                        if(state!=""){
                            if(district!=""){
                                if(address!=""){
                                    var new_party = new Party({
                                        partyType:partyType,
                                        firmName:firmName,
                                        GSTNo:GSTNo,
                                        image: base_url+req.files.Party_image[0].path,
                                        contactPersonName:contactPersonName,
                                        mobileNo:mobileNo,
                                        email:email,
                                        pincode:pincode,
                                        state:state,
                                        city:city,
                                        district:district,
                                        address:address,
                                        DOB:DOB,
                                        DOA:DOA,
                                        Created_date:get_current_date(),
                                        Updated_date:get_current_date(),
                                        status:"Active"
                                    })
                                    new_party.save().then(data=>{
                                        res.status(200).json({
                                            status:true,
                                            message:"Party created successfully",
                                            result:data
                                        });
                                    })
                                }else{
                                    res.json({
                                        status:false,
                                        message:"address is required"
                                    });
                                }
                            }else{
                                res.json({
                                    status:false,
                                    message:"district is required"
                                });
                            }
                        }else{
                            res.json({
                                status:false,
                                message:"state is required"
                            });
                        }
                    }else{
                        res.json({
                            status:false,
                            message:"City is required"
                        });
                    }
                }else{
                    res.json({
                        status:false,
                        message:"pincode is required"
                    });
                }
            }else{
                res.json({
                    status:false,
                    message:"Mobile Number is required"
                });
            }
        }else{
            res.json({
                status:false,
                message:"Firm Name is required"
            });
        }
    }else{
        res.json({
            status:false,
            message:"partyType is required"
        });
    }

});

router.patch('/editParty',imageUpload.fields([{name:"Party_image"}]),(req,res)=>{
    var id = req.body.id?req.body.id:"";
    Party.find({_id:id}).exec().then(party_data=>{
        if(party_data.length>0){
            var updated_party = {};
            if (req.body.partyType) {
                updated_party.partyType = req.body.partyType;
            }
            if (req.body.firmName) {
                updated_party.firmName = req.body.firmName;
            }
            if (req.body.GSTNo) {
                updated_party.GSTNo = req.body.GSTNo;
            }
            if (req.body.mobileNo) {
                updated_party.mobileNo = req.body.mobileNo;
            }
            if (req.body.pincode) {
                updated_party.pincode = req.body.pincode;
            }
            if (req.body.city) {
                updated_party.city = req.body.city;
            }
            if (req.body.state) {
                updated_party.state = req.body.state;
            }
            if (req.body.DOB) {
                updated_party.DOB = req.body.DOB;
            }
            if (req.body.district) {
                updated_party.district = req.body.district;
            }
            if (req.body.DOA) {
                updated_party.DOA = req.body.DOA;
            }
            if (req.body.email) {
                updated_party.email = req.body.email;
            }
            if (req.body.contactPersonName) {
                updated_party.contactPersonName = req.body.contactPersonName;
            }
            if (req.files.Party_image) {
                updated_party.image = base_url+req.files.Party_image[0].path;
            }
            if (req.body.address) {
                updated_party.address = req.body.address;
            }
            if (req.body.status) {
                updated_party.status = req.body.status;
            }
            updated_party.Updated_date = get_current_date();
            Party.findOneAndUpdate({ _id: id },updated_party,{ new: true },(err, doc) => {
                if (doc) {
                    res.status(200).json({
                      status: true,
                      message: "Update successfully",
                      results: updated_party,
                    });
                }
            });
        }else{
            res.json({
                status:false,
                message:"Party not exist"
            })
        }
    })
});

router.post('/getAllParty',async (req,res)=>{
    var page = req.body.page?req.body.page:"1";
    var limit = 5;
    var count =await Party.find();
    Party.find().limit(limit*1).skip((page - 1) * limit).exec().then(party_data=>{
        res.json({
            status:true,
            message:"All Party found successfully",
            result:party_data,
            pageLength:Math.ceil(count.length/limit)
        })
    })
});

router.get('/getParty',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    Party.find({_id:id}).exec().then(party_data=>{
        res.json({
            status:true,
            message:"Party found successfully",
            result:party_data
        })
    })
});

router.delete("/deleteParty", (req, res) => {
    var id = req.body.id ?req.body.id: "";
    if (id != "") {
      Party.findOneAndDelete({ _id: id })
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