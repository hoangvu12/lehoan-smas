const API = `${location.origin}/api/v1`;
// const API = "http://localhost:3000/api/v1";

const semestersContainer = document.querySelector(".nav-pills");
const subjectsContainer = document.querySelector(".subjects-container");
const exitAnalyzeBtn = document.querySelector(".exit-btn");

exitAnalyzeBtn.addEventListener("click", () => {
  const container = document.querySelector(".subject-analyze");

  container.classList.remove("show");
  document.body.classList.remove("blur");
});

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

async function handleShowAnalyze(subjectID, subjectName) {
  const containerSelector = ".subject-analyze";
  const container = document.querySelector(containerSelector);

  showLoading(containerSelector);
  container.classList.add("show");
  document.body.classList.add("blur");

  const analyze = await getSubjectAnalyze(
    subjectID,
    classID,
    studentID,
    currentSemester
  );

  showSubjectInfo(subjectName);
  showCharts(analyze);

  hideLoading(containerSelector);
}

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

function showCharts(analyze) {
  const container = document.querySelector(".subject-analyze");

  const charts = document.querySelectorAll(".chart");

  charts.forEach((chart) => chart.remove());

  document.querySelector(".error-alert")?.remove();

  const analysis = analyze.analysis;

  const validAnalysis = analysis.filter(
    (analyze) =>
      !isEmptyArray(analyze.details) &&
      (analyze.type === 6 || analyze.type === 7 || analyze.type === 1)
  );

  if (isEmptyArray(validAnalysis)) {
    const div = document.createElement("div");
    div.classList = "error-alert text-center fs-2 text-white";
    div.innerText = "Không đủ dữ liệu.";

    container.appendChild(div);

    return;
  }

  validAnalysis.forEach((analyze) => {
    const chartContainer = document.createElement("div");
    const description = document.createElement("div");

    const canvas = document.createElement("canvas");

    if (analyze.type === 1) {
      chartContainer.className = "row chart marks";
      canvas.className = "bar-chart bar-chart-marks";

      const options = {
        labels: analyze.details.map(
          (detail) => `${detail.key} | ${detail.evaluation}`
        ),
        data: analyze.details.map((detail) => detail.value),
        title: "ĐIỂM QUA CÁC THỜI Kì",
      };

      chartContainer.appendChild(canvas);
      chartContainer.appendChild(description);

      container.appendChild(chartContainer);

      generateLineChart(canvas, options);
    } else if (analyze.type === 6) {
      chartContainer.className = "row chart class";
      canvas.className = "bar-chart bar-chart-class";

      const options = {
        labels: analyze.details.map((detail) => detail.key),
        data: analyze.details.map((detail) => detail.percent),
        title: "LỚP",
      };

      description.innerHTML = `
      <div class="icon"><i class="fas fa-info-circle fa-2x"></i></div>
      <span>${analyze.description}</span>
      `;

      chartContainer.appendChild(canvas);
      chartContainer.appendChild(description);

      container.appendChild(chartContainer);

      generateBarChart(canvas, options);
    } else if (analyze.type === 7) {
      chartContainer.className = "row chart grade";
      canvas.className = "bar-chart bar-chart-grade";

      const options = {
        labels: analyze.details.map((detail) => detail.key),
        data: analyze.details.map((detail) => detail.percent),
        title: "KHỐI",
      };

      description.innerHTML = `
      <div class="icon"><i class="fas fa-info-circle fa-2x"></i></div>
      <span>${analyze.description}</span>
      `;

      chartContainer.appendChild(canvas);
      chartContainer.appendChild(description);

      container.appendChild(chartContainer);

      generateBarChart(canvas, options);
    }
  });
}

async function getSubjectAnalyze(subjectID, classID, studentID, semester = 2) {
  const URL = `${API}/class/${classID}/student/${studentID}/subject-analyze?subjectID=${subjectID}&semester=${semester}`;

  const { data } = await axios.get(URL);

  return data;
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
