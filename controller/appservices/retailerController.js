const express = require("express");
const mongoose = require("mongoose");
const Retailer = mongoose.model("Retailer");
const Employee = mongoose.model("Employee");
const Beat = mongoose.model("Beat");
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
                                let new_retailer = new Retailer({
                                    beat_id:beat_id,
                                    customer_type:customer_type,
                                    company_id:emp_data.companyId,
                                    employee_id:emp_data._id,
                                    pincode:pincode,
                                    address:address,
                                    firmName:firmName,
                                    GSTNo:GSTNo,
                                    customerName:customerName,
                                    area:area,
                                    location:location,
                                    mobileNo:mobileNo,
                                    DOB:DOB,
                                    DOA:DOA,
                                    Created_date:get_current_date(),
                                    Updated_date:get_current_date(),
                                    status:"Active"
                                })
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

router.post('/getAllRetailers',async (req,res)=>{
    let beat = req.body.beat?req.body.beat:"";
    let arr = [];
    let limit = 10;
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
    if(beat!=""){
        arr.push({company_id},{beat_id:beat})
    }else{
        arr.push({company_id})
    }
    let count = await Retailer.find({$and:arr});
    Retailer.find({$and:arr}).exec().then(retailer_data=>{
        if(retailer_data.length<1){
            return res.json({
                status:true,
                message:"No retailers found",
                result:[]
                }) 
        }else{
            let list = [];
            let countInfo = 0;
            for(let i = 0;i<retailer_data.length;i++){
                Beat.findOne({_id:retailer_data[i].beat_id}).exec().then(beat_data=>{
                    await (async function(rowData){
                        let data ={
                            beat_id:beat_data.beatName,
                            customer_type:rowData.customer_type,
                            employee_id:emp_data.employeeName,
                            company_id:rowData.company_id,
                            pincode:rowData.pincode,
                            address:rowData.address,
                            firmName:rowData.firmName,
                            GSTNo:rowData.GSTNo,
                            customerName:rowData.customerName,
                            area:rowData.area,
                            location:rowData.location,
                            mobileNo:rowData.mobileNo,
                            DOB:rowData.DOB,
                            DOA:rowData.DOA,
                            status:rowData.status,
                        }
                        list.push(data)
                    })(retailer_data[i])
                    countInfo++;
                    if(countInfo==party_data.length){
                        let c = Math.ceil(count.length/limit);
                        if(c==0){
                           c+=1;
                        }
                        res.json({
                          status:true,
                          message:"Retailers found successfully",
                          result:list,
                          pageLength:c
                      })
                    }                
                })
            }
        }
    })
})

module.exports= router;