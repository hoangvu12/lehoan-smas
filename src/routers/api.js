const express = require("express");
const router = express.Router();
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const cache = require("express-redis-cache")({
  host: process.env.REDIS_IP,
  port: 6379,
  expire: 86400, // A day
});

const controller = require("../controllers/api.controller");

router.get(
  "/search/class/:className/student/:studentName",
  cache.route(),
  controller.searchStudent
);

router.get(
  "/search/class/:className/student/:studentName/study",
  cache.route(),
  controller.searchStudent,
  controller.getStudy
);

router.get("/class/:classInput", cache.route(), controller.getClassContact);
router.get(
  "/class/:classID/student/:studentID",
  cache.route(),
  controller.getStudentInfo
);
router.get(
  "/class/:classID/student/:studentID/study",
  cache.route(),
  controller.getStudentInfo,
  controller.getStudy
);

module.exports = router;
