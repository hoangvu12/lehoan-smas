const API = require('../utils/API');

class SiteController {
  static search(req, res) {
    res.render("pages/index.ejs");
  }

  static async studentInfo(req, res) {
    const { classID, studentID } = req.params;
    
    const { data: contact } = await API.getContact(classID);

    const student = contact.find(
      (student) => student.pupil_id === Number(studentID)
    );
    
    student.class_id = classID;
    
    res.render("pages/student.ejs", { student });
  }
}

module.exports = SiteController;
