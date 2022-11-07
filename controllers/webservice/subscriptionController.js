const express = require('express');
const mongoose = require('mongoose');
const SubscriptionPlan = mongoose.model("subs");
const router = express.Router();

router.post('/addSubscription', async (req, res) => {
  console.log('add subscription');
  const { type, ems, dms } = req.body;
  const newSub = new SubscriptionPlan({
    type,
    ems,
    dms,
  });
  const savedDoc = await newSub.save();
  res
    .status(201)
    .json({ status: true, message: 'Added', result: savedDoc });
});
router.get('/listAllSubs', async (req, res) => {
  const allSubs = await SubscriptionPlan.find({});
  res.status(200).json({ status: true,message:"All plans found successfully", result :allSubs});
});
router.delete('/delSubs/:subId', async (req, res) => {
  const _id = req.params.subId;
  await SubscriptionPlan.findOneAndDelete({ _id });
  res.status(200).json({ status: true, message: 'Deleted' });
});

module.exports = router;