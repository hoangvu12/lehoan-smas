const submitBtn = document.querySelector(".submit-btn");
const studentName_input = document.querySelector(".student-name");
const className_select = document.querySelector("#class-select");
const semeter_select = document.querySelector("#semeter-select");

const API = `${location.origin}/api/v1`;
// const API = "http://localhost:3000/api/v1";

submitBtn.addEventListener("click", async function () {
  const studentName = studentName_input.value;
  const className = className_select.value;

  if (!studentName) {
    showError("Vui lòng nhập tên học sinh.");
    return;
  }

  if (!className || className === "Lớp") {
    showError("Vui lòng nhập lớp.");
    return;
  }

  const { data } = await axios.get(
    `${API}/search/class/${className}/student/${studentName}`
  );

  if (isEmptyArray(data)) {
    showError(`Không tìm thấy học sinh (${studentName})`);

    return;
  }

  showStudents(data);
});

function isEmptyArray(array) {
  return JSON.stringify(array) === "[]";
}

function showError(err) {
  const container = document.querySelector(".students-container");

  container.innerHTML = "";

  const html = `
        <div class="error fs-2 text-white text-center">
        ${err} 
        </div>
    `;

  container.append(html);
}

function showStudents(students) {
  const container = document.querySelector(".students-container");

  container.innerHTML = "";

  students.forEach((student) => {
    const html = `
    <div class="col-12 student-holder hvr-underline-from-center">
      <a href="/class/${student.class_id}/student/${student.pupil_id}">
        <div class="student-item">
          <div class="student-img">
            <img src="assets/profile-img.png" />
          </div>
          <div class="student-info">
            <div class="student-name">${student.name}</div>
            <div class="student-details">${student.gender} | ${student.birthday}</div>
          </div>
        </div>
      </a>
    </div>`;

    container.append(html);
  });
}
