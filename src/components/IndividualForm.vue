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
                    hide-default-footer
                    dense
      >
        <template v-slot:[`item.glucose`]="{ item }">
          <v-text-field
              v-model="item.glucose" @input="predict(item)"

          />
        </template>

        <template v-slot:[`item.age`]="{ item }">
          <v-text-field
              v-model="item.age" @input="predict(item)"

          />
        </template>

        <template v-slot:[`item.bmi`]="{ item }">
          <v-text-field
              v-model="item.bmi" @input="predict(item)"
          />
        </template>

        <template v-slot:[`item.insulin`]="{ item }">
          <v-text-field
              v-model="item.insulin" @input="predict(item)"
          />
        </template>

        <template v-slot:[`item.bp`]="{ item }">
          <v-text-field
              v-model="item.bp" @input="predict(item)"
          />
        </template>

        <template v-slot:[`item.st`]="{ item }">
          <v-text-field
              v-model="item.st" @input="predict(item)"
          />
        </template>

        <template v-slot:[`item.dpf`]="{ item }">
          <v-text-field
              v-model="item.dpf" @input="predict(item)"
              dense
          />
        </template>

        <template v-slot:[`item.pregnancies`]="{ item }">
          <v-text-field
              v-model="item.pregnancies" @input="predict(item)"
              dense
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
      rows: [
        {
          glucose: '110.53', //180
          age: '31', //33
          bmi: '30.84', //39
          insulin: '128.10', //160
          bp: '70.63', //88
          st:' 27.04', // 100
          dpf:'0.42', //1
          pregnancies:'3', //0
          prediction: ''
        }
      ],
      headers: [
        { title: 'Glucose', align: 'start', key: 'glucose' },
        { title: 'Age', key: 'age', value: 'age', description: '1. 20-65' },
        { title: 'BMI', value: 'bmi', description: 'Body mass index (weight in kg/(height in m)^2)' },
        { title: 'Insulin', value: 'insulin', description: '2-Hour serum insulin (mu U/ml)' },
        { title: 'BP', value: 'bp', description: 'blood pressure' },

        { title: 'ST', value: 'st', description: 'Triceps skin fold thickness (mm)' },
        { title: 'DPF', value: 'dpf', description: '' },
        { title: 'Pregnancies', value: 'pregnancies', description: 'number of times preganant' },

        { title: 'Prediction', value: 'prediction', align: 'center', key: 'prediction', description: '1. Positive, 2. Negative.' }
      ]
    };
  },
  mounted() {
    this.drawRadarChart();
  },
  methods: {
    drawRadarChart(patientData = null) {
      const diabetesAvg = [0.12, 0.66, 0.28, 0.03, 1.00, 0.05, 0.16, 0.06];
      const nonDiabetesAvg = [0.03, 0.48, 0.25, 0.01, 0.58, 0.02, 0.91, 0.02];
      const patientRadarData = patientData || [0.01, 0.54, 0.35, 0.13, 0.63, 0.15, 0.00, 0.15];  // Fallback if no patient data provided
      const data = [
        {
          type: 'scatterpolar',
          r: diabetesAvg,// Values for Diabetes Avg
          theta: ['Pregnancies', 'Glucose', 'Blood pressure', 'Skin thickness',
            'Insulin', 'Body mass index', 'Diabetes pedigree function', 'Age'], // Axis labels
          //fill: 'toself',
          line: { color: '#B22222' },
          name: 'Diabetes Avg'
        },
        {
          type: 'scatterpolar',
          r: nonDiabetesAvg, // Values for Non-Diabetes Avg
          theta: ['Pregnancies', 'Glucose', 'Blood pressure', 'Skin thickness',
            'Insulin', 'Body mass index', 'Diabetes pedigree function', 'Age'],
          //fill: 'toself',
          line: { color: '#006400' },
          name: 'Non-Diabetes Avg'
        },
        {
          type: 'scatterpolar',
          r: patientRadarData,
          theta: ['Pregnancies', 'Glucose', 'Blood pressure', 'Skin thickness',
            'Insulin', 'Body mass index', 'Diabetes pedigree function', 'Age'],
          //fill: 'toself',
          line: { color: ' #6c6fbe' },
          name: 'Patient Data'
        }
      ];

      const layout = {
        polar: {
          radialaxis: {
            visible: true,
            range: [0, 1],
            tickvals: [0, 0.1, 0.4, 0.6, 0.8, 1],  // Custom tick values for better readability
          }
        },
        showlegend: true,
        title: {
          text: 'Patient Metrics vs. Average Diabetes & Non-Diabetes Groups'
        }
      };

      Plotly.newPlot('radar-chart', data, layout);
    },
    predict(row) {
      if (row.glucose && row.age && row.bmi && row.insulin && row.bp && row.st && row.dpf && row.pregnancies) {
        // Prepare the data to send in the request body
        const requestData = {
          pregnancies: row.pregnancies,
          glucose: row.glucose,
          bp: row.bp,
          st: row.st,
          insulin: row.insulin,
          bmi: row.bmi,
          dpf: row.dpf,
          age: row.age
        };

        // Send a POST request to the Flask API
        fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // Set the content type to JSON
          },
          body: JSON.stringify(requestData)  // Convert the data object to JSON
        })
            .then(response => response.json())  // Parse the response as JSON
            .then(data => {
              // Handle the prediction result
              if (data.prediction) {
                row.prediction = data.prediction;  // Update the row with the prediction
              } else {
                row.prediction = 'No prediction available';
              }
              if (data.normalized){
                const radarValues = data.normalized.split(',').map(Number);  // Convert to an array of numbers
                this.drawRadarChart(radarValues);  // Re-render the chart with the updated data
              }else {
                this.drawRadarChart();  // Re-render the chart with default data
              }
            })
            .catch(error => {
              console.error('Error during prediction:', error);
              row.prediction = 'Error occurred during prediction';
            });
      } else {
        row.prediction = 'Invalid input data';
      }
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

