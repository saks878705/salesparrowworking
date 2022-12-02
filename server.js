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
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

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
app.use("/auth_api", require("./controllers/webservice/productCatagoryController"));
app.use("/auth_api", require("./controllers/webservice/productController"));
app.use("/auth_api", require("./controllers/webservice/routeController"));
app.use("/auth_api", require("./controllers/webservice/partyGrpController"));
app.use("/auth_api", require("./controllers/webservice/subscriptionController"));
app.use("/auth_api", require("./controllers/webservice/PurchaseSubController"));
app.use("/auth_api", require("./controllers/webservice/customerTypeController"));
app.use("/auth_api", require("./controllers/webservice/activityController"));
app.use("/auth_api", require("./controllers/webservice/partytypeController"));
app.use("/auth_api", require("./controllers/webservice/productVarientController"));
app.use("/auth_api", require("./controllers/webservice/brandController"));
app.use("/auth_api", require("./controllers/webservice/productgrpController"));

app.use("/app_api", require("./controller/appservices/empController"));
app.use("/app_api", require("./controller/appservices/changeBeatController"));
app.use("/app_api", require("./controller/appservices/attendanceController"));
app.use("/app_api", require("./controller/appservices/retailerController"));
app.use("/app_api", require("./controller/appservices/checkinController"));

app.listen(PORT, () => {
  console.log(`Express server started at port : ${PORT}`);
});
