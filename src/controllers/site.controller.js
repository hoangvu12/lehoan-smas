const API = require("../utils/API");
const utils = require("../utils");

class SiteController {
  static search(req, res) {
    res.render("pages/index.ejs", { ua: req.get("User-Agent"), utils });
  }

  static async studentInfo(req, res) {
    const { classID, studentID } = req.params;

    const contact = await API.getContact(classID);

    const student = contact.find(
      (student) => student.pupil_id === Number(studentID)
    );

    student.class_id = classID;

    // const student = { name: "Vũ", birthday: "14/06/2005", gender: "Nam" };

    res.render("pages/student.ejs", {
      student,
      ua: req.get("User-Agent"),
      utils,
    });
  }
}

module.exports = SiteController;
