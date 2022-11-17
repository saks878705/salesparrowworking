const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Saksham:SWw4cLQniR7Plsgh@cluster0.enmu34o.mongodb.net/salesparrow?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

//

require('./adminModel');
require('./roleModel');
require('./subAdminModel');
require('./employeeModel');
require('./beatModel');
require('./partyModel');
require('./locationModel');
require('./cardModel');
require('./bankDetailsModel');
require('./empTargetModel');
require('./goodDetailsModel');
require('./empGroupingModel');
require('./groupModel');
require('./leadModel');
require('./bannerModel');
require('./unitModel');
require('./productCatagoryModel');
require('./productModel');
require('./routeModel');
require('./pgroupModel');
require('./partyGrouping');
require('./subscriptionModel');
require('./purchaseSubModel');
require('./changeBeatModel');
require('./attendanceModel');
require('./retailerModel');
require('./customerTypeModel');
require('./activityModel');
require('./partytypeModel');

