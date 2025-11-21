const express = require("express");
const {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink,
} = require("../controllers/linkController.js");

const router = express.Router();

router.post("/", createLink);
router.get("/", getAllLinks);
router.get("/:code", getLinkStats);
router.delete("/:code", deleteLink);

module.exports = router;
