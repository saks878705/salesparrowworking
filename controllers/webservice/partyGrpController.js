const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const PartyGrouping = mongoose.model("PartyGrouping");
const Location = mongoose.model("Location");
const Party = mongoose.model("Party");
const PGroup = mongoose.model("PGroup");
const jwt = require("jsonwebtoken");

function get_current_date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (today = yyyy + "-" + mm + "-" + dd + " " + time);
};

router.post('/add_party_grp',(req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var partyIdStr = req.body.partyIdStr?req.body.partyIdStr:"";
    var partyIdArr = partyIdStr.split(",");
    var grp_name = req.body.grp_name?req.body.grp_name:"";
    var state = req.body.state?req.body.state:"";
    var grp_description = req.body.grp_description?req.body.grp_description:"";
    if(grp_name!=""){
        if(grp_description!=""){
            PGroup.find({grp_name}).exec().then(data=>{
                if(data.length<1){
                    var new_grp = new PGroup({
                        grp_name:grp_name,
                        grp_description:grp_description,
                        company_id:company_id,
                        state:state,
                        Created_date:get_current_date(),
                        Updated_date:get_current_date(),
                        status:"Active"
                    });
                    new_grp.save().then(doc=>{
                        if(doc){
                            PGroup.findOne({grp_name}).exec().then((data)=>{
                                for(let i = 0; i < partyIdArr.length; i++){
                                    Party.findOne({_id:partyIdArr[i]}).exec().then(async (party_data)=>{
                                        var new_party_grp = new PartyGrouping({
                                            grp_id:data._id,
                                            party_id:partyIdArr[i],
                                            partyName:party_data.firmName,
                                            company_id:company_id,
                                            Created_date:get_current_date(),
                                            Updated_date:get_current_date(),
                                            status:"Active"
                                        });
                                        await new_party_grp.save()
                                    });
                                }
                                PGroup.findOne({grp_name}).exec().then((data2)=>{
                                    PartyGrouping.find({grp_id:data2._id}).exec().then(pgdata=>{
                                        res.json({
                                            status:true,
                                            message:"Employee group created succesfully",
                                            grpDetails:data,
                                            partyGrpDetails:pgdata
                                        });
                                    });
                                })
                            });
                        }else{
                            res.json({
                                status:false,
                                message:"Party group not saved successfully."
                            })
                        }
                    });
                }else{
                    res.json({
                        status:false,
                        message:"Group Name already exists.Please think about another one."
                    })
                }
            })
        }else{
            res.json({
                status:false,
                message:"Group Name is required",
                result:null
            });
        }
    }else{
        res.json({
            status:false,
            message:"Atleast two Parties  is required",
            result:null
        });
    }
});


router.post('/edit_party_grp',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    var decodedToken = jwt.verify(token, "test");
    var company_id = decodedToken.user_id;
    var updated_grp = {};
    if(req.body.grp_name){
        updated_grp.grp_name = req.body.grp_name;
    }
    if(req.body.grp_description){
        updated_grp.grp_description = req.body.grp_description;
    }
    updated_grp.Updated_date = get_current_date();
    console.log(updated_grp);
    PGroup.findOneAndUpdate({_id:id},updated_grp,{new:true},(err,doc)=>{
        if(doc){
            if(req.body.partyIdStr){
                var partyIdArr = req.body.partyIdStr.split(",");
                console.log(partyIdArr);
                PartyGrouping.deleteMany({grp_id:id}).exec().then(async (err,doc)=>{
                    for(let i = 0; i < partyIdArr.length; i++){
                        console.log(partyIdArr[i]);
                        Party.findOne({_id:partyIdArr[i]}).exec().then(async (emp_data)=>{
                            console.log(emp_data)
                            var new_party_grp = new PartyGrouping({
                                grp_id:id,
                                emp_id:partyIdArr[i],
                                employeeName:emp_data.employeeName,
                                company_id:company_id,
                                Created_date:get_current_date(),
                                Updated_date:get_current_date(),
                                status:"Active"
                            });
                            await new_party_grp.save()
                        })
                    }
                        res.json({
                            status:true,
                            message:"Updated successfully"
                        })
                })
            }
        }else{
            res.json({
                status:false,
                message:"some error"
            });
        }
    })
});

router.post('/getGrpWisePartyList',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    PGroup.find({_id:id}).exec().then(grp_data=>{
        Location.find({_id:grp_data[0].state}).exec().then(state_data=>{
            PartyGrouping.find({grp_id:id}).exec().then(party_grp_data=>{
                var u_data = {
                    id:grp_data[0]._id,
                    grp_name:grp_data[0].grp_name,
                    grp_description:grp_data[0].grp_description,
                    state:state_data[0].name,
                    party_data:party_grp_data
                }
                res.json({
                    status:true,
                    message:"data found successfully",
                    result:u_data
                })
            })
        })
    })
})


router.delete('/deletePartyGrp',(req,res)=>{
    var id = req.body.id?req.body.id:"";
    PartyGrouping.deleteMany({grp_id:id}).exec().then(doc=>{
        if(doc){
            PGroup.deleteOne({_id:id}).exec().then(doc2=>{
                res.json({
                    status:true,
                    message:"group deleted successfully"
                });
            })
        }
    })
})

module.exports  = router;
