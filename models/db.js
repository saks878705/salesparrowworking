const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/saleSparrow', { useNewUrlParser: true }, (err) => {
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
require('./leadModel');
require('./bannerModel');
require('./unitModel');
require('./productCatagoryModel');
require('./productModel');

