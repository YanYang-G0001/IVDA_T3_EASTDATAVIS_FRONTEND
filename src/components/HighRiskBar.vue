<template>
  <div class="diabetes-dashboard">
    <div class="dashboard-header">
      <h2>Attributes Highly Related to Diabetes</h2>
    </div>
    <div style="height: 100%">
      <div style="height: 80%">
        <div id="HighRiskPlot" style="height: 100%; width: 100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Plotly from "plotly.js/dist/plotly";
export default {
  name: "HighRiskAttribute",
  data() {
    return {
      // Data for the chart: Highly related attributes
      attributes: [
        { name: "Attribute 1", score: 0.85 },
        { name: "Attribute 2", score: 0.75 },
        { name: "Attribute 3", score: 0.65 },
        { name: "Attribute 4", score: 0.60 },
        { name: "Attribute 5", score: 0.55 },
        { name: "Attribute 6", score: 0.50 },
        { name: "Attribute 7", score: 0.45 },
        { name: "Attribute 8", score: 0.40 },
        { name: "Attribute 9", score: 0.3 },
        { name: "Attribute 10", score: 0.2 },
      ],
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const xData = this.attributes.map((attr) => attr.name);
      const yData = this.attributes.map((attr) => attr.score);
      // Compute the colors based on scores
      const colors = yData.map((score) => {
        const red = 255 * score;// Red increases as score increases
        const green = 255 * (1 - score); // Green decreases as score increases
        return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`; // Red to green gradient
      });

      const trace = {
        x: xData,
        y: yData,
        type: "bar",
        marker: {
          color: colors,
        },
      };

      const layout = {

        xaxis: {
          title: "Attributes",
          tickangle: -45,
          font:{size: 40}
        },
        yaxis: {
          title: "Mutual Information Score",
        },
        margin: {
          l: 50,
          r: 50,
          t: 50,
          b: 100,
        },
      };

      Plotly.newPlot("HighRiskPlot", [trace], layout);
    },
  },
};
</script>

<style scoped>
.diabetes-dashboard {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
}

.dashboard-header {
  background-color: #1F4529;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}
.dashboard-header h2 {
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}
</style>