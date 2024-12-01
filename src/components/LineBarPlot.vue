<template>
  <div class="diabetes-dashboard">
    <v-container fluid>
      <div class="dashboard-header">
        <v-row align="center" justify="center" class="mt-1 mb-0">
          <h2>Diabetes Distribution In Subgroups</h2>
        </v-row>
      </div>

      <!-- Category selection dropdown -->
      <v-row align="center" justify="center" class="mt-2 mb-0">
        <v-select
            v-model="attributes.selectedValue"
            :items="attributes.values"
            :style="{ fontFamily: 'Roboto', fontSize: '20px' }"
            label="Select Attributes"
            multiple
            outlined
        />
      </v-row>
      <v-row>
        <!-- Bar Chart Column -->
        <v-col cols="8" style="height: 500px;">
          <div id="myStackedBarPlot" style="width: 100%; height: 100%;"></div>
        </v-col>

        <!-- Selected Subgroup Column -->
        <v-col cols="4" v-if="selectedBarData" style="height: 500px;">
          <v-card elevation="2" style="height: 100%; overflow-y: auto;">
            <v-card-title class="subtitle-1 font-weight-bold">
              selected subgroup
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col
                    cols="12"
                    sm="6"
                    v-for="attribute in attributes.selectedValue"
                    :key="attribute"
                >
                  <v-chip
                      :color="getAttributeColor(attribute)"
                      text-color="white"
                      small
                      class="ma-1"
                  >
                    {{ attribute }}: {{ getAttributeValue(attribute) }}
                  </v-chip>
                </v-col>
              </v-row>
              <!-- Pie Chart for Positive/Negative -->
              <div id="pieChart" style="width: 100%; height: 300px; margin-top: 10px;"></div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>


    </v-container>
  </div>
</template>

<script>
import Plotly from 'plotly.js/dist/plotly';


export default {
  name: "StackedBarPlot",

  data: () => ({
    StackedBarPlotData: {
      x: [],
      y: [],
      attribute: [],
      class_: [],
      countPositive: [],
      countNegative: []
    },
    attributes: {
      values: [
        'gender', 'polyuria', 'polydipsia', 'sudden_weight_loss', 'weakness',
        'polyphagia', 'genital_thrush', 'visual_blurring', 'itching', 'irritability',
        'delayed_healing', 'partial_paresis', 'muscle_stiffness', 'alopecia', 'obesity'
      ],
      selectedValue: ['gender', 'polyphagia']
    },
    selectedBarData: null,
    patientData: []
  }),

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        var reqUrl = 'http://127.0.0.1:5000/patientscat'
        console.log("ReqURLforStackedBarPlot " + reqUrl)
      } catch(error) {
        console.error('Error fetching patient data:');
      }

      const response = await fetch(reqUrl)
      this.patientData = await response.json();

      this.StackedBarPlotData.x = [];
      this.StackedBarPlotData.countPositive = [];
      this.StackedBarPlotData.countNegative = [];

      this.patientData.forEach((patient) => {
        let attributeValue = this.attributes.selectedValue
            .map(attribute => {
              if (attribute === 'gender') {
                return `gender-${patient[attribute].toLowerCase()}`;
              }
              return `${attribute}-${patient[attribute].toLowerCase()}`;
            })
            .join(',');

        if (!this.StackedBarPlotData.x.includes(attributeValue)) {
          this.StackedBarPlotData.x.push(attributeValue);
          this.StackedBarPlotData.countPositive.push(0);
          this.StackedBarPlotData.countNegative.push(0);
        }

        const attributeIndex = this.StackedBarPlotData.x.indexOf(attributeValue);
        if (patient.class_ === 'Positive') {
          this.StackedBarPlotData.countPositive[attributeIndex]++;
        } else if (patient.class_ === 'Negative') {
          this.StackedBarPlotData.countNegative[attributeIndex]++;
        }
      })

      this.drawStackedBarPlot();
    },

    drawStackedBarPlot() {
      const trace1 = {
        y: this.StackedBarPlotData.x,
        x: this.StackedBarPlotData.countPositive,
        type: 'bar',
        name: 'Positive',
        orientation:'h',
        text: this.StackedBarPlotData.countPositive.map(String),
        textposition: 'auto',
        hoverinfo: 'x+y+name',
        marker: { color: '#B22222' },
      };

      const trace2 = {
        y: this.StackedBarPlotData.x,
        x: this.StackedBarPlotData.countNegative,
        type: 'bar',
        name: 'Negative',
        orientation:'h',
        text: this.StackedBarPlotData.countNegative.map(String),
        textposition: 'auto',
        hoverinfo: 'x+y+name',
        marker: { color: '#31511E' },
      };

      const data = [trace1, trace2];

      const layout = {
        barmode: 'stack',
        yaxis: {
          title: 'Subgroups',
        },
        xaxis: {
          title: 'Number of Samples',
        },
        dragmode: 'zoom', // Enables zoom functionality
        margin: { t: 20, b: 40, l: 50, r: 20 }, // Adjust margins for better display
      };

      const config = {
        responsive: true,
        displayModeBar: true,
        staticPlot: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      };

      // Create plot and add click event
      Plotly.newPlot('myStackedBarPlot', data, layout, config);

      // Add click event listener
      document.getElementById('myStackedBarPlot').on('plotly_click', (data) => {
        const clickedCategory = data.points[0].y;
        this.handleBarClick(clickedCategory);
      });
    },
    drawPieChart(positiveCount, negativeCount) {
      this.$nextTick(() => {
        const pieChartElement = document.getElementById('pieChart');
        if (pieChartElement) {
          const data = [
            {
              values: [positiveCount, negativeCount],
              labels: ['Positive', 'Negative'],
              type: 'pie',
              textinfo: 'label+percent',
              insidetextorientation: 'radial',
              marker: {
                colors: ['#B22222', '#006400'],
              },
            },
          ];

          const layout = {
            height: 150,
            margin: { t: 0, b: 0, l: 0, r: 0 },
          };

          Plotly.newPlot('pieChart', data, layout, { responsive: true });
        } else {
          console.error('Pie chart container not found.');
        }
      });
    },


    handleBarClick(category) {
      // Find the patient matching the clicked category
      const matchingPatients = this.patientData.filter(patient => {
        // Check if the patient matches the selected categories
        return this.attributes.selectedValue.every(attr => {
          if (attr === 'gender') {
            return category.includes(`gender-${patient[attr].toLowerCase()}`)
          }
          return category.includes(`${attr}-${patient[attr].toLowerCase()}`)
        });
      });

      // If matching patients found, set the selected bar data
      if (matchingPatients.length > 0) {
        this.selectedBarData = {
          category: category,
          patients: matchingPatients
        };
        // Calculate Positive and Negative counts for Pie Chart
        const positiveCount = matchingPatients.filter(
            patient => patient.class_ === 'Positive'
        ).length;
        const negativeCount = matchingPatients.length - positiveCount;
        // Draw the Pie Chart
        this.drawPieChart(positiveCount, negativeCount);


      }
    },

    getAttributeColor(attribute) {
      if (!this.selectedBarData) return 'grey';

      // Find the first matching patient's attribute value
      const patient = this.selectedBarData.patients[0];

      // Special handling for gender
      if (attribute === 'gender') {
        return patient.gender.toLowerCase() === 'male' ? 'blue' : 'pink';
      }

      // For other attributes
      const value = patient[attribute];
      if (value === 'Yes') return '#B22222';
      if (value === 'No') return '#006400';
      return 'grey';
    },

    getAttributeValue(attribute) {
      if (!this.selectedBarData) return 'N/A';

      // Find the first matching patient's attribute value
      const patient = this.selectedBarData.patients[0];

      // Return the value for the given attribute
      return patient[attribute] || 'N/A';
    }
  },

  watch: {
    'attributes.selectedValue': function () {
      this.StackedBarPlotData.x = [];
      this.StackedBarPlotData.countPositive = [];
      this.StackedBarPlotData.countNegative = [];
      this.fetchData();
    }
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