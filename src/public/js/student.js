const API = `${location.origin}/api/v1`;
// const API = "http://localhost:3000/api/v1";

const semestersContainer = document.querySelector(".nav-pills");
const subjectsContainer = document.querySelector(".subjects-container");

subjectsContainer.addEventListener("click", (e) => {
  if (!e.path.some((el) => el.classList.contains("subject-item"))) {
    return;
  }

  const subjectItem = e.path.find((el) =>
    el.classList.contains("subject-item")
  );

  handleShowAnalyze(subjectItem.dataset.id, subjectItem.dataset.name);

  window.scrollTo(0, 0);
});

semestersContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("nav-link")) return;

  const activeSemesters = document.querySelectorAll(".nav-link.active");

  activeSemesters.forEach((semester) => semester.classList.remove("active"));

  e.target.classList.add("active");

  currentSemester = e.target.dataset.semester;

  handleShowPage(currentSemester);
});

async function handleShowPage(semester) {
  //TODO: Some logic here to handle page when user change semester.

  const containerSelector = ".container";

  showLoading(containerSelector);

  const semesterInfo = await getSemesterInfo(classID, studentID, semester);

  showOverAllStats(semesterInfo.evaluation);
  showLearningStats(semesterInfo.subjects);

  hideLoading(containerSelector);
}

function showOverAllStats(evaluation) {
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
        <div class="subject-item hvr-underline-from-center" data-id="${
          subject.subject_id
        }" data-name="${subject.name}">
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

function showSubjectInfo(subjectName) {
  const subjectName_div = document.querySelector(
    ".subject-analyze .subject-name"
  );

  subjectName_div.innerText = subjectName;
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

function hideLoading(selector) {
  const parentContainer = document.querySelector(selector);

  parentContainer.classList.remove("loading");
}

function showLoading(selector) {
  const parentContainer = document.querySelector(selector);

  parentContainer.classList.add("loading");
}
