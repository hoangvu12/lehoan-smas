const express = require("express");
const router = express.Router();

const controller = require("../controllers/site.controller");

router.get("/", controller.search);

router.get("/class/:classID/student/:studentID", controller.studentInfo);

module.exports = router;
