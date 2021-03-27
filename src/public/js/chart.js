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
      maintainAspectRatio: false,
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
      maintainAspectRatio: false,
    },
  });
}
