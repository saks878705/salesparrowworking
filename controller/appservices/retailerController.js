const express = require("express");
const mongoose = require("mongoose");
const Retailer = mongoose.model("Retailer");
const Employee = mongoose.model("Employee");
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

router.post('/addRetailer',(req,res)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.json({
            status:false,
            message:"Token must be provided"
            })
    }
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
    Employee.findOne({_id:employee_id}).exec().then(emp_data=>{
        if(emp_data.status=="InActive" || emp_data.status=="UnApproved"){
            return res.json({
                status:false,
                message:"You are Inactive. Please contact company."
                }) 
        }
    })
   let beat_id= req.body.beat_id?req.body.beat_id:""
   let customer_type= req.body.customer_type?req.body.customer_type:""
   let pincode= req.body.pincode?req.body.pincode:""
   let address= req.body.address?req.body.address:""
   let firmName= req.body.firmName?req.body.firmName:""
   let GSTNo= req.body.GSTNo?req.body.GSTNo:""
   let customerName= req.body.customerName?req.body.customerName:""
   let area= req.body.area?req.body.area:""
   let location= req.body.location?req.body.location:""
   let mobileNo= req.body.mobileNo?req.body.mobileNo:""
   let DOB= req.body.DOB?req.body.DOB:""
   let DOA= req.body.DOA?req.body.DOA:""
   if(beat_id!=""){
    if(customer_type!=""){
        if(firmName!=""){
            if(customerName!=""){
                if(location!=""){
                    if(mobileNo!=""){
                        if(DOB!=""){
                            if(DOA!=""){
                                
                            }else{
                                 res.json({
                                     status:false,
                                     message:"DOA must be selected"
                                 })
                            }
                        }else{
                             res.json({
                                 status:false,
                                 message:"DOB must be selected"
                             })
                        }
                    }else{
                         res.json({
                             status:false,
                             message:"Mobile number must be given"
                         })
                    }
                }else{
                     res.json({
                         status:false,
                         message:"Location must be selected"
                     })
                }
            }else{
                 res.json({
                     status:false,
                     message:"customerName must be selected"
                 })
            }
        }else{
             res.json({
                 status:false,
                 message:"Firm name must be given"
             })
        }
    }else{
         res.json({
             status:false,
             message:"Customer Type must be selected"
         })
    }
   }else{
        res.json({
            status:false,
            message:"Beat must be selected"
        })
   }
})

module.exports= router;