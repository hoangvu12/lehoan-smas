const exitAnalyzeBtn = document.querySelector(".exit-btn");

exitAnalyzeBtn.addEventListener("click", () => {
  const container = document.querySelector(".subject-analyze");

  container.classList.remove("show");
  document.body.classList.remove("blur");
});

async function handleShowAnalyze(subjectID, subjectName) {
  const containerSelector = ".subject-analyze";
  const container = document.querySelector(containerSelector);

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
}

function showCharts(analyze) {
  const validAnalyzeType = [1, 6, 7];

  const container = document.querySelector(".subject-analyze");

  const charts = document.querySelectorAll(".chart");

  charts.forEach((chart) => chart.remove());

  document.querySelector(".error-alert")?.remove();

  const analysis = analyze.analysis;

  const validAnalysis = analysis.filter(
    (analyze) =>
      !isEmptyArray(analyze.details) && validAnalyzeType.includes(analyze.type)
  );

  if (isEmptyArray(validAnalysis)) {
    const div = document.createElement("div");
    div.classList = "error-alert text-center fs-2 text-white";
    div.innerText = "Không đủ dữ liệu.";

    container.appendChild(div);

    return;
  }

  validAnalysis.forEach((analyze) => showChart(analyze));
}

function showChart(analyze) {
  const container = document.querySelector(".subject-analyze");

  const options = {
    1: {
      chartType: "line",
      labels: analyze.details.map(
        (detail) => `${detail.key} | ${detail.evaluation}`
      ),
      data: analyze.details.map((detail) => detail.value),
      title: "ĐIỂM QUA CÁC THỜI Kì",
      name: "marks",
      container,
      analyze,
    },
    6: {
      chartType: "bar",
      labels: analyze.details.map((detail) => detail.key),
      data: analyze.details.map((detail) => detail.percent),
      title: "LỚP",
      name: "class",
      container,
      analyze,
    },
    7: {
      chartType: "bar",
      labels: analyze.details.map((detail) => detail.key),
      data: analyze.details.map((detail) => detail.percent),
      title: "KHỐI",
      name: "grade",
      container,
      analyze,
    },
  };

  const chartOptions = options[analyze.type];

  createChart(chartOptions);
}

function createChart(options) {
  const charts = {
    line: generateLineChart,
    bar: generateBarChart,
  };

  const chartContainer = document.createElement("div");
  const description = document.createElement("div");

  const canvas = document.createElement("canvas");

  description.className = "description";
  chartContainer.className = `row chart ${options.name}`;
  // canvas.className = `${options.chartType}-chart ${options.chartType}-chart-${options.name}`;

  if (options.analyze.description) {
    description.innerHTML = `
      <div class="icon"><i class="fas fa-info-circle fa-2x"></i></div>
      <span>${options.analyze.description}</span>
  `;
  }

  chartContainer.appendChild(canvas);
  chartContainer.appendChild(description);

  options.container.appendChild(chartContainer);

  charts[options.chartType](canvas, options);
}

async function getSubjectAnalyze(subjectID, classID, studentID, semester = 2) {
  const URL = `${API}/class/${classID}/student/${studentID}/subject-analyze?subjectID=${subjectID}&semester=${semester}`;

  const { data } = await axios.get(URL);

  return data;
}

function generateBarChart(el, { labels, data, title }) {
  return new Chart(el, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          backgroundColor: "#faaa20",
          data,
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        fontColor: "white",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: "white",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: "white",
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: true,
    },
  });
}

function generateLineChart(el, { labels, data, title }) {
  return new Chart(el, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Điểm",
          data,
          fill: false,
          borderColor: "#ff6500",
          pointRadius: 5,
          pointHoverRadius: 10,
          pointHitRadius: 30,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: title,
        fontColor: "white",
      },
      legend: {
        display: true,
        labels: {
          fontColor: "white",
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: "white",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: "white",
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: true,
    },
  });
}
