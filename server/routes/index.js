const express = require("express");
const machineRouter = require("./machineRouter");
const userRouter = require('./userRouter');
const scheduleRouter = require('./scheduleRouter')
const router = express.Router();

router.use('/machine', machineRouter);
router.use('/schedule', scheduleRouter);
router.use('/user', userRouter);

router.use((err, req, res, next) => {
  console.error("err", err.message);
  res.status(500).send(err.message);
});

module.exports = router;