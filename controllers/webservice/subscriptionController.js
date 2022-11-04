const express = require('express');
const mongoose = require('mongoose');
const SubscriptionPlan = require('../../models/subscriptionModal');
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
    .json({ Error: false, message: 'Added', subscription: savedDoc });
});
router.get('/listAllSubs', async (req, res) => {
  const allSubs = await SubscriptionPlan.find({});
  res.status(200).json({ Error: false, allSubscriptions });
});
router.delete('/delSubs/:subId', async (req, res) => {
  const _id = req.params.subId;
  await SubscriptionPlan.findOneAndDelete({ _id });
  res.status(200).json({ Error: false, message: 'Deleted' });
});

module.exports = router;