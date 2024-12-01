<template>
  <div class="diabetes-dashboard">
      <div class="dashboard-header">
        <v-row align="center" justify="center" class="mt-1 mb-0">
          <h2>Individual Diabetes Risk Prediction</h2>
        </v-row>
      </div>

    <v-container fluid style="font-size: 30px; padding: 0;">

      <!-- Data Table -->
      <v-data-table theme="grey"
                    :headers="headers"
                    :items="rows"
                    items-per-page="1"
      >
        <template v-slot:[`item.glucose`]="{ item }">
          <v-text-field
              v-model="item.glucose"

          />
        </template>

        <template v-slot:[`item.age`]="{ item }">
          <v-text-field
              v-model="item.age"

          />
        </template>

        <template v-slot:[`item.bmi`]="{ item }">
          <v-text-field
              v-model="item.bmi"
          />
        </template>

        <template v-slot:[`item.insulin`]="{ item }">
          <v-text-field
              v-model="item.insulin"
          />
        </template>

        <template v-slot:[`item.bp`]="{ item }">
          <v-text-field
              v-model="item.bp"
          />
        </template>

        <!-- Prediction Result Column -->
        <template v-slot:[`item.prediction`]="{ item }">
          <v-text-field
              v-model="item.prediction"
              :value="item.prediction"
              readonly
          />
        </template>

      </v-data-table>

      <!-- Radar Chart -->
      <v-row align="center" justify="center" class="mt-4">
        <div id="radar-chart" style="width: 1000px; height: 500px;">

        </div>
      </v-row>
    </v-container>
  </div>
  </template>

<script>
import Plotly from 'plotly.js/dist/plotly';

export default {
  data() {
    return {
      categories: ['Yes', 'No'], // List of categories for dropdown
      gender: ['Male', 'Female'],
      rows: [
        {
          glucose: '2',
          age: '25',
          bmi: '20',
          insulin: '20',
          bp: '80',
          prediction: 'Positive'
        }
      ],
      headers: [
        { title: 'Glucose', align: 'start', key: 'glucose' },
        { title: 'Age', key: 'age', value: 'age', description: '1. 20-65' },
        { title: 'BMI', value: 'bmi', description: '' },
        { title: 'Insulin', value: 'insulin', description: '' },
        { title: 'BP', value: 'bp', description: 'blood pressure' },
        { title: 'Prediction', value: 'prediction', align: 'center', key: 'prediction', description: '1. Positive, 2. Negative.' }
      ]
    };
  },
  mounted() {
    this.drawRadarChart();
  },
  methods: {
    drawRadarChart() {
      const data = [
        {
          type: 'scatterpolar',
          r: [3, 5, 2, 4, 3], // Values for Patient 1
          theta: ['Polyuria', 'Polydipsia', 'Age', 'Weakness', 'Obesity'], // Axis labels
          fill: 'toself',
          name: 'Diabetes Avg'
        },
        {
          type: 'scatterpolar',
          r: [4, 3, 5, 2, 4], // Values for Patient 2
          theta: ['Polyuria', 'Polydipsia', 'Age', 'Weakness', 'Obesity'],
          fill: 'toself',
          name: 'Non-Diabetes Avg'
        },
        {
          type: 'scatterpolar',
          r: [2, 4, 3, 5, 2], // Values for Patient 3
          theta: ['Polyuria', 'Polydipsia', 'Age', 'Weakness', 'Obesity'],
          fill: 'toself',
          name: 'Patient Data'
        }
      ];

      const layout = {
        polar: {
          radialaxis: {
            visible: true,
            range: [0, 5]
          }
        },
        showlegend: true,
        title: {
          text: 'Patient Metrics vs. Average Diabetes & Non-Diabetes Groups'
        }
      };

      Plotly.newPlot('radar-chart', data, layout);
    }
  }
};
</script>

<style scoped>
.diabetes-dashboard {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  height: 800px;
  font-size: 40px !important
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

