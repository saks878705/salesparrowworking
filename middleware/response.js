const express = require('express')
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.json({status: false,message: "Token must be provided",});
    let x = token.split(".")
    if(x.length<3) return res.send({status:false,message:"Invalid token"})
    var decodedToken = jwt.verify(token, "test");
    var employee_id = decodedToken.user_id;
  
    jwt.verify(token, "test", (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }