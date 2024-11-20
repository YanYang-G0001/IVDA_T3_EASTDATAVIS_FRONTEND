<template>
  <div>
    <!-- Container for the parallel coordinates plot -->
    <v-container fluid style="padding: 0; height: 100vh;">
      <v-row align="center" justify="center" class="mt-1 mb-0">
        <v-select
            v-model="attributes.selectedValue"
            :items="attributes.values"
            label="Select Attributes"
            multiple
            dense
            outlined
        />
      </v-row>

      <v-row align="center" justify="center" class="mt-1 mb-0">
        <div>
          <h3>Patient Data Parallel Coordinates</h3>
        </div>
      </v-row>

      <!-- Plot container -->
      <div style="height: 80%; width: 100%">
        <div id="parallelCoordinatesPlot" style="height: 100%; width: 100%"></div>
      </div>
    </v-container>
  </div>
</template>

<script>
import Plotly from 'plotly.js/dist/plotly';
export default {
  name: "ParallelCoordinatesPlot",
  data() {
    return {
      patients: [], // To store patient data
      attributes: {
        selectedValue: ['gender', 'polyphagia'], // Default attributes for parallel coordinates
        values: [
          'gender', 'polyuria', 'polydipsia', 'sudden_weight_loss', 'weakness',
          'polyphagia', 'genital_thrush', 'visual_blurring', 'itching', 'irritability',
          'delayed_healing', 'partial_paresis', 'muscle_stiffness', 'alopecia', 'obesity'
        ],
      },
    };
  },
  mounted() {
    this.fetchPatientData(); // Fetch data when the component is mounted
  },
  methods: {
    async fetchPatientData() {
      const reqUrl = 'http://127.0.0.1:5000/patientscat'; // Your API URL
      const response = await fetch(reqUrl);
      const responseData = await response.json();

      this.patients = responseData; // Save the data from the backend
      this.drawParallelCoordinatesPlot(); // Draw the plot after data is fetched
    },

    drawParallelCoordinatesPlot() {
      // Filter the data based on selected attributes
      const selectedAttributes = this.attributes.selectedValue;
      const data = this.patients.map(patient => {
        // Extract the selected attributes for each patient
        let patientData = {};
        selectedAttributes.forEach(attribute => {
          patientData[attribute] = patient[attribute];
        });
        return patientData;
      });

      // Define the parallel coordinates plot data
      const trace = {
        type: 'parcoords',
        line: {
          color: data.map(patient => (patient.class_ === 'Positive' ? 'green' : 'red')), // Color by class_
          showscale: true,
        },
        dimensions: selectedAttributes.map(attr => ({
          label: attr,
          values: data.map(patient => patient[attr]),
        })),
      };

      const layout = {
        title: 'Parallel Coordinates Plot - Patient Data',
      };

      const config = { responsive: true };

      // Render the plot
      Plotly.newPlot('parallelCoordinatesPlot', [trace], layout, config);
    },
  },

  watch: {
    'attributes.selectedValue': function () {
      this.drawParallelCoordinatesPlot(); // Re-draw the plot when selected values change
    }
  },
};
</script>
