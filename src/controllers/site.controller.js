class SiteController {
  static search(req, res) {
    res.render("pages/index.ejs");
  }

  static studentInfo(req, res) {
    res.render("pages/student.ejs", { student: req.params });
  }
}

module.exports = SiteController;
