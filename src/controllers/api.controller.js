const API = require("../utils/API");
const { stringToSlug } = require("../utils/");

const CLASSES_ID = {
  b1: "443472547",
  b2: "443472548",
  b3: "443472549",
  b4: "443472550",
  b5: "443472551",
  b6: "443472552",
  b7: "443472553",
  b8: "443472554",
  b9: "443472555",
  a1: "443472532",
  a2: "443472533",
  a3: "443472534",
  a4: "443472535",
  a5: "443472536",
  a6: "443472537",
  a7: "443472538",
  a8: "443472539",
  a9: "443472540",
};

class APIController {
  static async getStudentInfo(req, res, next) {
    const { classID, studentID } = req.params;

    const contact = await API.getContact(classID);

    const student = contact.find(
      (student) => student.pupil_id === Number(studentID)
    );

    if (!req.url.includes("study")) {
      return res.status(200).json(student);
    }

    req.studentID = studentID;
    req.classID = classID;

    next();
  }

  static async searchStudent(req, res, next) {
    const { className, studentName } = req.params;

    const classID = CLASSES_ID[className.toLowerCase()];

    const contact = await API.getContact(classID);

    const student = contact
      .filter((student) =>
        stringToSlug(student.name).endsWith(stringToSlug(studentName))
      )
      .map((student) => {
        const newStudentObj = { ...student };

        newStudentObj.class_id = classID;

        return newStudentObj;
      });

    if (!req.url.includes("study")) {
      return res.status(200).json(student);
    }

    req.studentID = student[0].pupil_id;
    req.classID = classID;

    next();
  }

  static async getClassContact(req, res) {
    const { classInput } = req.params;

    let classId;

    classId = classInput;

    if (classInput in CLASSES_ID) {
      classId = CLASSES_ID[classInput];
    }

    if (!Object.values(CLASSES_ID).includes(classId)) {
      return res.sendStatus(400);
    }

    const contact = await API.getContact(classId);

    res.status(200).json(contact);
  }

  static async getStudy(req, res) {
    const { classID, studentID } = req;

    const { semester = 2 } = req.query;

    const study = await API.getStudy(studentID, classID, semester);

    res.status(200).json(study);
  }
}

module.exports = APIController;
