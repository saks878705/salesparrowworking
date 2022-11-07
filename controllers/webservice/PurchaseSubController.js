const express = require("express");
const mongoose = require("mongoose");
const Purchase = mongoose.model("Purchase");
const router = express.Router();
const jwt = require("jsonwebtoken");

function get_current_date() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (today = yyyy + "-" + mm + "-" + dd + " ");
}

const getEndDate = (months) => {
  let date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
};

router.post("/addPurchasePlan", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.json({
      status: false,
      message: "Token is required",
    });
  }
  var decodedToken = jwt.verify(token, "test");
  var company_id = decodedToken.user_id;
  var ems = req.body.ems ? req.body.ems : "";
  var type = req.body.type ? req.body.type : "";
  Purchase.findOne({ company_id })
    .exec()
    .then((purchase_data) => {
      if (purchase_data) {
        var updated_purchase = {};
        let start_date_dms = new Date()
         let end_date_dms = getEndDate(ems.duration)
         if (req.body.dms) {
            let newDms = {...dms, start_date_dms , end_date_dms}
          updated_purchase.dms = newDms;
        }
        Purchase.findOneAndUpdate(
          { company_id },
          updated_purchase,
          { new: true },
          (err, doc) => {
            if (err) {
              res.json({
                status: false,
                message: "Some error",
              });
            } else {
              res.json({
                status: true,
                message: "Updated successfully",
                result: updated_purchase,
              });
            }
          }
        );
      } else {
         let start_date_ems = new Date()
         let end_date_ems = getEndDate(ems.duration)
         let newEms = {...ems, start_date_ems , end_date_ems}
        var new_purchase = new Purchase({
          type: type,
          ems: newEms,
          company_id: company_id,
        });
        new_purchase.save().then((doc) => {
          res.json({
            status: true,
            message: "Added successfully",
            result: doc,
          });
        });
      }
    });
});

router.get("/getPurchasePlan", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.json({
      status: false,
      message: "Token is required",
    });
  }
  var decodedToken = jwt.verify(token, "test");
  var company_id = decodedToken.user_id;
  Purchase.findOne({ company_id })
    .exec()
    .then((purchase_data) => {
      if (!purchase_data) {
        res.json({
          status: true,
          message: "No plan found",
          result:[]
        });
      } else {
        res.json({
          status: true,
          message: "plan found",
          result: purchase_data,
        });
      }
    });
});

module.exports = router;
