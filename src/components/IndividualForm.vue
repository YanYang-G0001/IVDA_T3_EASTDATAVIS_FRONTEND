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
          // st:' 27.04', // 100
          // dpf:'0.42', //1
          // pregnancies:'3', //0
          prediction: ''
        }
      ],
      headers: [
        { title: 'Glucose', align: 'start', key: 'glucose' },
        { title: 'Age', key: 'age', value: 'age', description: '1. 20-65' },
        { title: 'BMI', value: 'bmi', description: 'Body mass index (weight in kg/(height in m)^2)' },
        { title: 'Insulin', value: 'insulin', description: '2-Hour serum insulin (mu U/ml)' },
        { title: 'BP', value: 'bp', description: 'blood pressure' },
        //{ title: 'ST', value: 'st', description: 'Triceps skin fold thickness (mm)' },
        //{ title: 'DPF', value: 'dpf', description: '' },
        // { title: 'Pregnancies', value: 'pregnancies', description: 'number of times preganant' },

        { title: 'Prediction', value: 'prediction', align: 'center', key: 'prediction', description: '1. Positive, 2. Negative.' }
      ],
      //use average value to replace non-displayed attribute
      constantPregnancies: 3,
      constantDPF: 0.47,
      constantST:29.1
    };
  },
  mounted() {
    this.drawRadarChart();
  },
  methods: {
    drawRadarChart(patientData = null) {
      const diabetesAvg = [0.63, 0.52, 0.23, 0.35, 0.27];
      const nonDiabetesAvg = [0.43, 0.48, 0.14, 0.26, 0.17];
      const patientRadarData = patientData || [0.53, 0.5, 0.185, 0.305, 0.22];  // Fallback if no patient data provided,
      const labels = ['Glucose', 'BP', 'Insulin', 'BMI', 'Age']; // Axis labels
      const closedLabels = [...labels, labels[0]];
      const data = [
        {
          type: 'scatterpolar',
          r: [...diabetesAvg, diabetesAvg[0]],// Values for Diabetes Avg
          theta:  closedLabels, // Axis labels
          //fill: 'toself',
          line: { color: '#B22222' },
          mode: 'lines+markers',
          name: 'Diabetes Avg',
        },
        {
          type: 'scatterpolar',
          r: [...nonDiabetesAvg, nonDiabetesAvg[0]], // Values for Non-Diabetes Avg
          theta:  closedLabels,
          //fill: 'toself',
          line: { color: '#006400' },
          name: 'Non-Diabetes Avg'
        },
        {
          type: 'scatterpolar',
          r: [...patientRadarData, patientRadarData[0]],
          theta:  closedLabels,
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
            tickvals: [0, 0.2, 0.4, 0.6, 0.8, 1],  // Custom tick values for better readability
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
      if (row.glucose && row.age && row.bmi && row.insulin && row.bp) {
        // Prepare the data to send in the request body
        const requestData = {
          pregnancies: this.constantPregnancies,
          glucose: row.glucose,
          bp: row.bp,
          st: this.constantST,
          insulin: row.insulin,
          bmi: row.bmi,
          dpf: this.constantDPF,
          age: row.age
        };
        console.log('Request Data:', requestData);

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
              console.log('Response Data:', data.normalized);
              console.log('Response Data Type:', typeof data.normalized);
              if (data.normalized){
                const rawValues = data.normalized.split(',');
                console.log('Raw Values:', rawValues);

                const radarValues = data.normalized.split(',').map(Number); // Convert each item to a number

                console.log('Cleaned Radar Values:', radarValues);
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
  font-size: 34px;
  font-weight: 500;
  margin: 0;
}
::v-deep(.v-data-table-header__content) {
  font-size: 20px !important;
  margin-top: 10px !important;
}
::v-deep(.v-field) {
  font-size: 20px !important;
  margin-top: 10px !important;
}
</style>