const express = require("express");
const router = express.Router();

const controller = require("../controllers/api.controller");

router.get(
  "/search/class/:className/student/:studentName",
  controller.searchStudent
);

router.get(
  "/search/class/:className/student/:studentName/study",
  controller.searchStudent,
  controller.getStudy
);

router.get("/class/:classInput", controller.getClassContact);
router.get("/class/:classID/student/:studentID", controller.getStudentInfo);
router.get(
  "/class/:classID/student/:studentID/study",
  controller.getStudentInfo,
  controller.getStudy
);

module.exports = router;
