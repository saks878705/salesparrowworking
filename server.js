require("./models/db");

const express = require("express");
const PORT = process.env.PORT || 5000;
const bodyparser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use(bodyparser.json());
app.use("/images", express.static(__dirname + "/images"));


app.get("/", (req, res) => {
  res.status(200).send("Homepage");
});

app.use("/auth_api", require("./controllers/webservice/AuthAPIController"));
app.use("/auth_api", require("./controllers/webservice/subadminController"));
app.use("/auth_api", require("./controllers/webservice/roleController"));
app.use("/auth_api", require("./controllers/webservice/employeeController"));
app.use("/auth_api", require("./controllers/webservice/beatController"));
app.use("/auth_api", require("./controllers/webservice/partyController"));
app.use("/auth_api", require("./controllers/webservice/locationController"));
app.use("/auth_api", require("./controllers/webservice/cardController"));
app.use("/auth_api", require("./controllers/webservice/bankDetailsController"));
app.use("/auth_api", require("./controllers/webservice/messageController"));
app.use("/auth_api", require("./controllers/webservice/empTargetController"));
app.use("/auth_api", require("./controllers/webservice/goodDetailsController"));
app.use("/auth_api", require("./controllers/webservice/empGrpController"));
app.use("/auth_api", require("./controllers/webservice/leadController"));
app.use("/auth_api", require("./controllers/webservice/bannerController"));
app.use("/auth_api", require("./controllers/webservice/unitController"));
app.use(
  "/auth_api",
  require("./controllers/webservice/productCatagoryController")
);
app.use("/auth_api", require("./controllers/webservice/productController"));

app.listen(PORT, () => {
  console.log("Express server started at port : 3000");
});
