const express = require("express");
const { redirectLink } = require("../controllers/linkController.js");

const router = express.Router();

router.get("/:code", redirectLink);

module.exports = router;
