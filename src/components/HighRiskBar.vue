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
        { name: "Polyuria", score: 0.252752 },
        { name: "Polydipsia", score: 0.232332 },
        { name: "Sudden weight loss", score: 0.129721 },
        { name: "Age", score: 0.114526 },
        { name: "Gender", score: 0.092069 },
        { name: "Irritability", score: 0.083030 },
        { name: "Partial paresis", score: 0.073523 },
        { name: "Polyphagia", score: 0.061367 },
        { name: "Visual blurring", score: 0.035589 },
        { name: "Alopecia", score: 0.033681 },
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
      const minScore = Math.min(...yData);
      const maxScore = Math.max(...yData);

      const colors = yData.map((score) => {

        const normalizedScore = (score - minScore) / (maxScore - minScore);
        const red = 255 * normalizedScore// Red increases as score increases
        const green = 255 * (1 - normalizedScore); // Green decreases as score increases
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
          titlefont: {
            size: 20,  // Set the font size of the x-axis labels
            family: 'Arial, sans-serif', // Optional: set the font family
            color: '#000000', // Optional: set the color of the x-axis labels
          },

          tickfont: {
            size: 20,  // Set the font size of the x-axis labels
            family: 'Arial, sans-serif', // Optional: set the font family
            color: '#000000', // Optional: set the color of the x-axis labels
          },
        },
        yaxis: {
          title: "Mutual Information Score",
          titlefont: {
            size: 15,  // Set the font size of the x-axis labels
            family: 'Arial, sans-serif', // Optional: set the font family
            color: '#000000', // Optional: set the color of the x-axis labels
          },
          tickfont: {
            size: 15,  // Set the font size of the x-axis labels
            family: 'Arial, sans-serif', // Optional: set the font family
            color: '#000000', // Optional: set the color of the x-axis labels
          },
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