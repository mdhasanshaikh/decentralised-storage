const express = require("express");
const fs = require("fs");

const router = express.Router();

// @route GET api/ipfsConfig
// @desc ipfs peer config
// @access Public
router.get("/", (req, res) => {
  var file = fs.createReadStream("./files/sample.txt");
  file.pipe(res);
});

module.exports = router;
