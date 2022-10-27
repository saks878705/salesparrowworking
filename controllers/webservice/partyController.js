const express = require("express");
const mongoose = require("mongoose");
const Party = mongoose.model("Party");
const Location = mongoose.model("Location");
const router = express.Router();
const jwt = require("jsonwebtoken");
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
    const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token){
    return res.json({
      status:false,
      message:"Token must be provided"
    })
  }
  var decodedToken = jwt.verify(token, "test");
  var company_id = decodedToken.user_id;
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
    var route = req.body.route?req.body.route:"";
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
                                        company_id:company_id,
                                        pincode:pincode,
                                        state:state,
                                        route:route,
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
            if (req.body.route) {
                updated_party.route = req.body.route;
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
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
      return res.json({
        status:false,
        message:"Token must be provided"
      })
    }
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var page = req.body.page?req.body.page:"1";
    var limit = 5;
    var count =await Party.find({company_id});
    var list = [];
    var state = req.body.state?req.body.state:"";
    if(state!=""){
        Party.find({ $and: [{company_id},{state}]}).limit(limit*1).skip((page - 1) * limit).exec().then(party_data=>{
            if(party_data.length>0){
                let counInfo = 0;
                for(let i=0;i<party_data.length;i++){
                    Location.findOne({_id:party_data[i].state}).exec().then(state_data=>{
                        Location.findOne({_id:party_data[i].city}).exec().then(city_data=>{
                            Location.findOne({_id:party_data[i].district}).exec().then(async (district_data)=>{
                                await (async function (rowData) {
                                    var u_data = {
                                      id:rowData._id,
                                      state:{name:state_data.name,id:rowData.state},
                                      city:{name:city_data.name,id:rowData.city},
                                      district:{name:district_data.name,id:rowData.district},
                                      firmName:rowData.firmName,
                                      areas:rowData.address,
                                      status:rowData.status
                                    };
                                    list.push(u_data);
                                  })(party_data[i]);
                                  counInfo++;
                                  if(counInfo==party_data.length){
                                    let c = Math.ceil(count.length/limit);
                                    if(c==0){
                                       c+=1;
                                    }
                                    res.json({
                                      status:true,
                                      message:"Parties for this state found successfully",
                                      result:list,
                                      pageLength:c
                                  })
                                  }
                            })
                        })
                    })
                }
            }else{
                res.json({
                    status:true,
                    message:"No party found",
                    result:[]
                })
            }
        })
    }else{
        Party.find({company_id}).limit(limit*1).skip((page - 1) * limit).exec().then(party_data=>{
            if(party_data.length>0){
                let counInfo = 0;
                for(let i=0;i<party_data.length;i++){
                    Location.findOne({_id:party_data[i].state}).exec().then(state_data=>{
                        Location.findOne({_id:party_data[i].city}).exec().then(city_data=>{
                            Location.findOne({_id:party_data[i].district}).exec().then(async (district_data)=>{
                                await (async function (rowData) {
                                    var u_data = {
                                        id:rowData._id,
                                        state:{name:state_data.name,id:rowData.state},
                                        city:{name:city_data.name,id:rowData.city},
                                        district:{name:district_data.name,id:rowData.district},
                                        firmName:rowData.firmName,
                                        address:rowData.address,
                                        partyType:rowData.partType,
                                        image:rowData.image,
                                        pincode:rowData.pincode,
                                        GSTNo:rowData.GSTNo,
                                        contactPersonName:rowData.contactPersonName,
                                        mobileNo:rowData.mobileNo,
                                        email:rowData.email,
                                        DOB:rowData.DOB,
                                        DOA:rowData.DOA,
                                        route:rowData.route,
                                      status:rowData.status
                                    };
                                    list.push(u_data);
                                  })(party_data[i]);
                                  counInfo++;
                                  if(counInfo==party_data.length){
                                    let c = Math.ceil(count.length/limit);
                                    if(c==0){
                                       c+=1;
                                    }
                                    res.json({
                                      status:true,
                                      message:"All Parties found successfully",
                                      result:list,
                                      pageLength:c
                                  })
                                  }
                            })
                        })
                    })
                }
            }else{
                res.json({
                    status:true,
                    message:"No party found",
                    result:[]
                })
            }
        })
    }
});

router.post('/getParty',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    if(id!=""){
        Party.findOne({_id:id}).exec().then(party_data=>{
            if(party_data){
                Location.findOne({_id:party_data.state}).exec().then(state_data=>{
                    Location.findOne({_id:party_data.city}).exec().then(city_data=>{
                        Location.findOne({_id:party_data.district}).exec().then(district_data=>{
                                var u_data = {
                                  id:party_data._id,
                                  state:{name:state_data.name,id:party_data.state},
                                  city:{name:city_data.name,id:party_data.city},
                                  district:{name:district_data.name,id:party_data.district},
                                  firmName:party_data.firmName,
                                  address:party_data.address,
                                  partyType:party_data.partType,
                                  image:party_data.image,
                                  pincode:party_data.pincode,
                                  GSTNo:party_data.GSTNo,
                                  contactPersonName:party_data.contactPersonName,
                                  mobileNo:party_data.mobileNo,
                                  email:party_data.email,
                                  DOB:party_data.DOB,
                                  DOA:party_data.DOA,
                                  route:party_data.route,
                                };
                                res.json({
                                  status:true,
                                  message:" Party found successfully",
                                  result:u_data,
                              }) 
                        })
                    })
                })
            }else{
                res.json({
                    status:false,
                    message:"Party data not found",
                    result:[]
                })
            }
        })
    }else{
        res.json({
            status:false,
            message:"Id is required"
        })
    }
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