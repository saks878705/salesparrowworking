const express      = require('express');
var router         = express.Router();
const base_url     = 'http://43.205.115.51';
const jwt          = require('jsonwebtoken');
const bcrypt       = require('bcrypt');
const mongoose     = require('mongoose');
const Admin     = mongoose.model('AdminInfo')


function get_current_date(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return today = yyyy + '-' + mm + '-' + dd + ' ' + time; 
}

const multer = require("multer");
const path = require('path');

const imageStorage = multer.diskStorage({
  destination: 'images/user_img', 
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() 
     + path.extname(file.originalname))
  }
});

/*const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|JPEG|JPG)$/)) { 
     return cb(new Error('Please upload a Image'))
   }
   cb(undefined, true)
 }
})*/

const getDecodedToken = async (authHeader) => {
  try{
    console.log('entered get decoded token utility....');
    if(!authHeader){
      console.log('token not provided or user not logged in');
    }
    const authHeaderStringSplit = authHeader.split(' ');
    if(!authHeaderStringSplit[0] || authHeaderStringSplit[0].toLowerCase() !== 'bearer' || !authHeaderStringSplit[1]){
     console.log('token not provided or user not logged in');
   }
   const token = authHeaderStringSplit[1];
   const decodedToken = jwt.verify(token, "test");
   return decodedToken;
 } catch(error){
  throw error;
}
}

router.post('/register',(req,res)=>{
  console.log(req.body);
  var companyName = req.body.companyName ? req.body.companyName : "";
  var phone = req.body.phone ? req.body.phone : "";
  var password = req.body.password ? req.body.password : "";
  var email = req.body.email ? req.body.email : "";
  var city = req.body.city ? req.body.city : "";
  var state = req.body.state ? req.body.state : "";
  var pincode = req.body.pincode ? req.body.pincode : "";
  var GSTNo = req.body.GSTNo ? req.body.GSTNo : "";
  if (companyName != "") {
    if (phone != "") {
      if (password != "") {
        if (email != "") {
          if (city != "") {
            if(state!=""){
              if(pincode!=""){
                if(GSTNo!=""){
                  Admin.find({ email: email }).exec().then((email_info) => {
                    if (email_info.length < 1) {
                      bcrypt.hash(password, 10, function (err, hash) {
                        var new_admin = new Admin({
                          company_name: companyName,
                          phone: phone,
                          password: hash,
                          email: email,
                          city: city,
                          state: state,
                          pincode: pincode,
                          GSTNo: GSTNo,
                          Created_date: get_current_date(),
                          Updated_date: get_current_date(),
                          status: "Active",
                        });
                        new_admin.save().then((data) => {
                          res.status(200).json({
                            status: true,
                            message: "New Admin is created successfully",
                            results: data,
                          });
                        });
                      });
                    } else {
                      res.status(200).json({
                        status: false,
                        message: "Email already exists",
                        result: null,
                      });
                    }
                  });
                }else{
                  return res.json({
                    status: false,
                    message: "GSTNo is required",
                    results: null,
                  });
                }
              }else{
                return res.json({
                  status: false,
                  message: "PINCODE is required",
                  results: null,
                });
              }
            }else{
              return res.json({
                status: false,
                message: "State is required",
                results: null,
              });
            }
          } else {
            return res.json({
              status: false,
              message: "City is required",
              results: null,
            });
          }
        } else {
          return res.json({
            status: false,
            message: "Email is required",
            results: null,
          });
        }
      } else {
        return res.json({
          status: false,
          message: "Password is required",
          results: null,
        });
      }
    } else {
      return res.json({
        status: false,
        message: "Phone is required",
        results: null,
      });
    }
  } else {
    return res.json({
      status: false,
      message: "CompanyName is required",
      results: null,
    });
  }
});

router.post('/register2',(req,res)=>{
  console.log(req.body);
  res.send(req.body);
});

router.post('/adminLogin',(req,res)=>{
  console.log(req.body);
  var email = (req.body.email) ? req.body.email : "";
  var password = (req.body.password) ? req.body.password : "";
  if(email!=""){
    if(password!=""){
      Admin.findOne({email:email}).exec().then(admin_data=>{
        if(admin_data){
          bcrypt.compare(password,admin_data.password,function (err, result){
            console.log(result);
            if(result){
              const token = jwt.sign({ user_id: admin_data._id, is_token_valide: 1 },"test");
              res.json({
                status:true,
                message:"Login Successful",
                result:admin_data,
                token:token
            })
            }else{
              res.json({
                status:false,
                message:"password is not matched.please check"
              })
            }
          })
        }else{
          res.json({
            status:false,
            message:"Admin not found"
          })
        }

      })
    }else{
      res.json({
        status:false,
        message:"password is required"
      })
    }
  }else{
    res.json({
      status:false,
      message:"email is required"
    })
  }
});

router.post('/updateProfile',(req,res)=>{
  var token = req.body.token?req.body.token:"";
  if(token!=""){
    var decodedToken = jwt.verify(token, "test");
    var user_id = decodedToken.user_id;
    Admin.find({_id:user_id}).exec().then(user_data=>{
      if(user_data.length>0){
        var updated_admin = {};
        if(req.body.companyName){
          updated_admin.company_name = req.body.companyName;
        }
        if(req.body.contactPersonName){
          updated_admin.contactPersonName = req.body.contactPersonName;
        }
        if(req.body.email){
          updated_admin.email = req.body.email;
        }
        if(req.body.phone){
          updated_admin.phone = req.body.phone;
        }
        if(req.body.companyAddress){
          updated_admin.companyAddress = req.body.companyAddress;
        }
        if(req.body.pincode){
          updated_admin.pincode = req.body.pincode;
        }
        if(req.body.state){
          updated_admin.state = req.body.state;
        }
        if(req.body.city){
          updated_admin.city = req.body.city;
        }
        if(req.body.district){
          updated_admin.district = req.body.district;
        }
        if(req.body.GSTNo){
          updated_admin.GSTNo = req.body.GSTNo;
        }
        if(req.body.companyCatagory){
          updated_admin.companyCatagory = req.body.companyCatagory;
        }
        if(req.body.companyDescription){
          updated_admin.companyDescription = req.body.companyDescription;
        }
        if(req.body.companyType){
          updated_admin.companyType = req.body.companyType;
        }
        updated_admin.Updated_date = get_current_date();
        Admin.findOneAndUpdate({_id:user_id},updated_admin,{new:true},(err,doc)=>{
          if(doc){
            res.status(200).json({
              status:true,
              message:"Updated successfully",
              details:updated_admin
            })
          }else{
            res.json({
              status:false,
              message:"Eroor",
              details:err
            })
          }
        })
      }else{
        res.json({
          status:false,
          message:"user not found . Please check the token."
        })
      }
    })
  }
})

module.exports = router;