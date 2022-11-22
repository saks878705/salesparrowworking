const express      = require('express');
var router         = express.Router();
const base_url     = 'https://salesparrow.teknikoglobal.com/';
const jwt          = require('jsonwebtoken');
const bcrypt       = require('bcrypt');
const mongoose     = require('mongoose');
const Admin     = mongoose.model('AdminInfo');
const Location     = mongoose.model('Location');
const sgmail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require('path');


function get_current_date(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return today = yyyy + '-' + mm + '-' + dd + ' ' + time; 
}


const imageStorage = multer.diskStorage({
  destination: 'images/admin_img', 
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now());
  },
});

const imageUpload = multer({
  storage: imageStorage,
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

function order_id() {
  var text = "";
  var possible = "1234567890";
  for (var i = 0; i < 3; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
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
                  Admin.find({ phone: phone }).exec().then((phone_info) => {
                    Admin.find({ email: email }).exec().then(async (email_info) => {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var yyyy = today.getFullYear().toString();
                    console.log(yyyy);
                    if (phone_info.length < 1) {
                      if(email_info.length>0) return res.json({status:false,message:"Email already exists"})
                      let csc2;
                      let company =await Admin.findOne().sort({companyShortCode2:-1});
                      if(company){
                        console.log("companyShortCode2------",company.companyShortCode2)
                        csc2 = company.companyShortCode2 +1;
                      }else{
                        console.log("inside else")
                        csc2 = 1;
                      }
                      bcrypt.hash(password, 10, function (err, hash) {
                        // var companyName_s = companyName;
                        // companyName_s = companyName_s.slice(0,4);
                        // let rand_int = order_id();
                        // let csc = companyName_s+dd+yyyy+rand_int;
                        let csc = `${companyName.slice(0,4)}${dd}${yyyy.slice(2)}`;
                        
                        console.log("random", csc);
                        var new_admin = new Admin({
                          company_name: companyName,
                          companyShortCode:csc,
                          companyShortCode2:csc2,
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
                        message: "Phone already exists",
                        result: null,
                      });
                    }
                  })
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
  console.log(req.body);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if(token){
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
});

router.post('/profileImage',imageUpload.fields([{name:"profile_image"}]),(req,res)=>{
  console.log(req.body);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if(token){
    var decodedToken = jwt.verify(token, "test");
    var user_id = decodedToken.user_id;
    Admin.find({_id:user_id}).exec().then(user_data=>{
      if(user_data){
        updated_admin  = {};
        if(req.files.profile_image){
          updated_admin.profileImage = base_url+req.files.profile_image[0].path;
        }
        Admin.findOneAndUpdate({_id:user_id},updated_admin,{new:true},(err,doc)=>{
          if(doc){
            res.status(200).json({
              status:true,
              message:"Updated Successfully",
              result:updated_admin
            })
          }else{
            res.json({
              status:false,
              message:"Error",
              result:err
            })
          }
        })
      }else{
        res.json({
          status:false,
          message:"Token must be correct."
        })
      }
    })
  }else{
    res.json({
      status:false,
      message:"Token is required."
    })
  }
})

router.get('/getadminprofile',(req,res)=>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token)
  console.log(typeof token)
  if( token){
    var decodedToken = jwt.verify(token, "test");
    var user_id = decodedToken.user_id;
    Admin.findOne({_id:user_id}).exec().then(admin_data=>{
      if(!admin_data){
        return res.json({
          status:false,
          message:"Please login again"
        })
      }
      console.log(admin_data)
        Location.findOne({ _id: admin_data.state }).exec().then((state_data) => {
          Location.findOne({ _id: admin_data.city }).exec().then((city_data) => {
            if(admin_data.district==""){
              var u_data = {
                id:admin_data._id,
                company_name:admin_data.company_name,
                phone:admin_data.phone,
                companyShortCode:`${admin_data.companyShortCode}${admin_data.companyShortCode2}`,
                password:admin_data.password,
                email:admin_data.email,
                city:{name:city_data.name,id:city_data._id},
                state:{name:state_data.name,id:state_data._id},
                pincode:admin_data.pincode,
                GSTNo:admin_data.GSTNo,
                companyAddress:admin_data.companyAddress,
                companyCatagory:admin_data.companyCatagory,
                companyDescription:admin_data.companyDescription,
                companyType:admin_data.companyType,
                contactPersonName:admin_data.contactPersonName,
                district:"",
                signatureImage:admin_data.signatureImage,
                profileImage:admin_data.profileImage,
              };
              res.status(200).json({
                status:true,
                message:"Get Successfully",
                result:[u_data]
              })
            }else{
              Location.findOne({ _id: admin_data.district}).exec().then(async (area_data) => {
                  console.log("inside if");
                  var u_data = {
                    id:admin_data._id,
                    company_name:admin_data.company_name,
                    phone:admin_data.phone,
                    password:admin_data.password,
                    email:admin_data.email,
                    city:{name:city_data.name,id:city_data._id},
                    companyShortCode:`${admin_data.companyShortCode}${admin_data.companyShortCode2}`,
                    state:{name:state_data.name,id:state_data._id},
                    pincode:admin_data.pincode,
                    GSTNo:admin_data.GSTNo,
                    companyAddress:admin_data.companyAddress,
                    companyCatagory:admin_data.companyCatagory,
                    companyDescription:admin_data.companyDescription,
                    companyType:admin_data.companyType,
                    contactPersonName:admin_data.contactPersonName,
                    district:{name:area_data.name,id:area_data._id},
                    signatureImage:admin_data.signatureImage,
                    profileImage:admin_data.profileImage,
                  };
                  res.status(200).json({
                    status:true,
                    message:"Get Successfully",
                    result:[u_data]
                  })
                })
              }
            });
        });
      });
    
  }else{
    res.json({
      status:false,
      message:"Token is required."
    })
  }

});

router.post('/addSignature',imageUpload.fields([{name:"signature_image"}]),(req,res)=>{
  console.log(req.body);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if(token){
    var decodedToken = jwt.verify(token, "test");
    var user_id = decodedToken.user_id;
    Admin.find({_id:user_id}).exec().then(user_data=>{
      if(user_data){
        updated_admin  = {};
        if(req.files.signature_image){
          updated_admin.signatureImage = base_url+req.files.signature_image[0].path;
        }
        Admin.findOneAndUpdate({_id:user_id},updated_admin,{new:true},(err,doc)=>{
          if(doc){
            res.status(200).json({
              status:true,
              message:"Updated Successfully",
              result:updated_admin
            })
          }else{
            res.json({
              status:false,
              message:"Error",
              result:err
            })
          }
        })
      }else{
        res.json({
          status:false,
          message:"Token must be correct."
        })
      }
    })
  }else{
    res.json({
      status:false,
      message:"Token is required."
    })
  }
});

router.get('/removeSignature',(req,res)=>{
  console.log(req.headers['authorization']);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if(token){
    var decodedToken = jwt.verify(token, "test");
    var user_id = decodedToken.user_id;
    Admin.updateOne({_id:user_id},{$set:{signatureImage:""}},(err,data)=>{
      if(err){
        res.json({
          status:false,
          message:"User not found"
        })
      }else{
        res.json({
          status:true,
          message:"Updated Successfully",
          result:data
        })
      }
    })

  }else{
    res.json({
      status:false,
      message:"Token is required."
    })
  }
})

router.post('/forgotPasswordAdmin',(req,res)=>{
  var email = req.body.email?req.body.email:"";
  Admin.findOne({email:email}).exec().then(admin_data=>{
    const token = jwt.sign({ user_id: admin_data._id, is_token_valid: 1 },"test");
    /*const api_key =  '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';
    sgmail.setApiKey(api_key);
    const message = {
      to:admin_data.email,
      from:{
        name:'SaleSparrow',
        email:'Saksham1840097@akgec.ac.in',
      },
      subject:'Regarding Password Change',
      html: `<a href="http://localhost:3000/resetpassword/${token}">Reset password</a>`
      //text:token
    }
    sgmail.send(message).then((err,data)=>{
      if(err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
        res.json({
          status:true,
          message:"Check your Email",
        })
    }
    })*/
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        //api_key: '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',
        user: 'anamika.gautam@zoxima.com',
        pass: 'Kanpur@8787'
      }
    })
    let mailDetails = {
      from: 'anamika.gautam@zoxima.com',
      to: email,
      subject: 'Password change',
      html: `<a href="https://salesparrow.herokuapp.com/resetPasswordAdmin/${token}">Reset password</a>`
      //text: token
  };
   
  transporter.sendMail(mailDetails, function(err, data) {
      if(err) {
          console.log(err);
      } else {
          console.log('Email sent successfully');
      }
  });
    res.json({
      status:true,
      message:"Check your Email",
      token:token
    })

  })
});

router.post('/resetPasswordAdmin',(req,res)=>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  var password = req.body.password?req.body.password:"";
  if(token){
    if(password!=""){
      const decodedToken = jwt.verify(token,"test");
      const Admin_id = decodedToken.user_id;
      Admin.findOne({_id:Admin_id}).exec().then(data=>{
        bcrypt.hash(password,10,function(err,hash){
          var updated_admin = {};
          updated_admin.password = hash;
          Admin.findOneAndUpdate({_id:Admin_id},updated_admin,{ new: true },(err, doc)=>{
            if(doc){
              res.json({
                status:true,
                message:"Password updated successfully",
                result:updated_admin
              })
            }else{
              res.json({
                status:false,
                message:"Error",
                result:err
              })
            }
          })
        }) 
      })
    }else{
      res.json({
        status:false,
        message:"Password is required"
      })
    }
  }else{
    res.json({
      status:false,
      message:"Token is required"
    })
  }
});

router.post('/changePassword',(req,res)=>{
  //console.log(req.body);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  var oldPassword = req.body.oldPassword?req.body.oldPassword:"";
  var newPassword = req.body.newPassword?req.body.newPassword:"";
  if(token){
    if(oldPassword!=""){
      if(newPassword!=""){
        const decodedToken = jwt.verify(token,"test");
        const Admin_id = decodedToken.user_id;
        Admin.findOne({_id:Admin_id}).exec().then(async (company_data)=>{
          if(company_data){
            bcrypt.compare(oldPassword,company_data.password,async function (err, result){
              if(result){
                var updated_admin = {};
                const newhash = await bcrypt.hash(newPassword, 10);
                updated_admin.password = newhash;
                updated_admin.Updated_date = get_current_date();
                Admin.findOneAndUpdate({_id:Admin_id},updated_admin,{new:true},(err,doc)=>{
                  if(doc){
                    res.status(200).json({
                      status:true,
                      message:"Updated Successfully",
                      result:updated_admin
                    })
                  }else{
                    res.json({
                      status:false,
                      message:"Error",
                      result:err
                    })
                  }
                })
              }else{
                res.json({
                  status:false,
                  message:"Password didn't match."
                });
              }
            })
          }else{
            res.json({
              status:false,
              message:"No company found."
            });
          }
        })
      }else{
        res.json({
          status:false,
          message:"New Password is required"
        });
      }
    }else{
      res.json({
        status:false,
        message:"Old Password is required"
      });
    }
  }else{
    res.json({
      status:false,
      message:"Token is required"
    });
  }
})

module.exports = router;