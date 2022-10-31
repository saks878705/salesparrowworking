const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const PartyGrouping = mongoose.model("PartyGrouping");
const Location = mongoose.model("Location");
const Employee = mongoose.model("Employee");
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