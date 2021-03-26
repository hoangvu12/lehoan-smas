// const API = `${location.origin}/api/v1`;
const API = "http://localhost:3000/api/v1";

const semestersContainer = document.querySelector(".nav-pills");

semestersContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("nav-link")) return;

  const activeSemesters = document.querySelectorAll(".nav-link.active");

  activeSemesters.forEach((semester) => semester.classList.remove("active"));

  e.target.classList.add("active");

  handleShowPage(e.target.dataset.semester);
});

async function handleShowPage(semester) {
  //TODO: Some logic here to handle page when user change semester.

  showLoading();

  const semesterInfo = await getSemesterInfo(classID, studentID, semester);

  console.log(semesterInfo);

  showOverAllStats(semesterInfo.evaluation);
  showLearningStats(semesterInfo.subjects);

  hideLoading();
}

async function showStudentInfo() {
  const student = await getStudentInfo(classID, studentID);

  const studentName = document.querySelector(".student-name");
  const studentDetails = document.querySelector(".student-details");

  studentName.innerText = student.name;
  studentDetails.innerText = `${student.gender} | ${student.birthday}`;
}

function showOverAllStats(evaluation) {
  console.log(evaluation);

  const container = document.querySelector(".student-overall");

  container.innerText = "";

  const capacity =
    findObjectInArray(evaluation, "key", "HOC_LUC").value || "Không có";
  const ranking =
    findObjectInArray(evaluation, "key", "XEP_HANG").value || "Không có";

  container.innerText = `${capacity} | #${ranking}`;
}

function showLearningStats(subjects) {
  const container = document.querySelector(".subjects-container");

  container.innerHTML = "";

  subjects.forEach((subject) => {
    const html = `
    
      <div class="col-md-6 col-lg-6 col-12">
        <div class="subject-item hvr-underline-from-center">
          <div class="subject-name">Môn ${subject.name}</div>
          <div class="subject-marks">
            <div class="subject-mark">
              <div class="mark-name">Thường xuyên:</div>
              <div class="marks">${showMarks(subject.mark_m)}</div>
            </div>

            <div class="subject-mark">
              <div class="mark-name">Giữa kỳ:</div>
              <div class="marks">${showMarks(subject.mark_v)}</div>
            </div>

            <div class="subject-mark">
              <div class="mark-name">Cuối kỳ:</div>
              <div class="marks">${showMarks(subject.mark_semester)}</div>
            </div>

            <div class="subject-mark">
              <div class="mark-name fw-bold fs-5">TBM:</div>
              <div class="marks">${showMarks(subject.mark_average)}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.append(html);
  });

  function showMarks(marks) {
    if (Array.isArray(marks)) {
      if (marks.every((mark) => !mark.mark || !mark)) {
        return "Không có";
      }

      return marks.map(({ mark }) => mark).join(", ");
    }

    return marks || "Không có";
  }
}

async function getSemesterInfo(classID, studentID, semester = 2) {
  //TODO: Add get semester info from API.

  const URL = `${API}/class/${classID}/student/${studentID}/study?semester=${semester}`;

  const { data } = await axios.get(URL);

  return data;
}

async function getStudentInfo(classID, studentID) {
  const { data } = await axios.get(
    `${API}/class/${classID}/student/${studentID}`
  );

  return data;
}

function hideLoading() {
  const parentContainer = document.querySelector(".container");

  parentContainer.classList.remove("loading");
}

function showLoading() {
  const parentContainer = document.querySelector(".container");

  parentContainer.classList.add("loading");
}
