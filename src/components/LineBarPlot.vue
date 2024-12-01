<template>
  <div class="diabetes-dashboard">

  <div>
    <v-container fluid style="padding: 0; height: 60vh;">
      <div class="dashboard-header">
      <v-row align="center" justify="center" class="mt-1 mb-0">
          <h2>Diabetes Distribution In Subgroups</h2>
      </v-row>
      </div>
    <!-- Category selection dropdown -->
    <v-row align="center"
           justify="center"
           class="mt-2 mb-0"
            >
      <v-select
          v-model="attributes.selectedValue"
          :items="attributes.values"
          label="Select Attributes"
          multiple
          outlined
          class="custom-select"
      />


    </v-row>

    <div style="height: 90%">
      <div id='myStackedBarPlot' :style="{ height: plotHeight + 'px', width: '100%' }"></div>
    </div>
    </v-container>
  </div>

  </div>

</template>

<script>
import Plotly from 'plotly.js/dist/plotly';
import {blue} from "vuetify/util/colors";

export default {
  name: "StackedBarPlot",

  computed: {
    blue() {
      return blue
    },
    plotHeight() {
      // Set a base height and add extra space for each category
      const baseHeight = 500;  // Minimum height for the plot
      const categoryHeight = 30;  // Height per category (this can be adjusted)
      const categoryCount = this.StackedBarPlotData.x.length;

      // Calculate height: base height + additional space for each category
      return baseHeight + categoryCount * categoryHeight;
    }
  },
  // defined in parent component, no need to import, already be rendered in the template
  // props: ["selectedCategory","selectedCompany"],
  data: () => ({
    StackedBarPlotData: { x: [], y: [], attribute: [], class_: [], countPositive: [], countNegative: [] },
    attributes: {
      values: [
        'gender', 'polyuria', 'polydipsia', 'sudden_weight_loss', 'weakness',
        'polyphagia', 'genital_thrush', 'visual_blurring', 'itching', 'irritability',
        'delayed_healing', 'partial_paresis', 'muscle_stiffness', 'alopecia', 'obesity'
      ],
      selectedValue: ['gender', 'polyphagia']
    },
  }),
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try{
        // req URL to retrieve single company from backend
        var reqUrl = 'http://127.0.0.1:5000/patientscat'
        console.log("ReqURLforStackedBarPlot " + reqUrl)}
      catch(error){ console.error('Error fetching patient data:' );
      }
      // await response and data
      const response = await fetch(reqUrl)
      const responseData = await response.json();

      // Process and organize data for stacked bar plot
      this.StackedBarPlotData.x = [];
      this.StackedBarPlotData.countPositive = [];
      this.StackedBarPlotData.countNegative = [];

      responseData.forEach((patient) => {
        // Construct category value based on selected categories
        let attributeValue = this.attributes.selectedValue
            .map(attribute => {
              // Special handling for gender, to generate gender-male, gender-female
              if (attribute === 'gender') {
                return `gender-${patient[attribute].toLowerCase()}`;
              }
              // For other attributes, generate like polyuria-yes, polyuria-no
              return `${attribute}-${patient[attribute].toLowerCase()}`;
            })
            .join(','); // Combine the selected categories into one string, like 'gender-male-polyuria-yes'

        // Add category to X-axis if it doesn't already exist
        if (!this.StackedBarPlotData.x.includes(attributeValue)) {
          this.StackedBarPlotData.x.push(attributeValue);
          this.StackedBarPlotData.countPositive.push(0);
          this.StackedBarPlotData.countNegative.push(0);
        }

        // Find the index of the current category
        const attributeIndex = this.StackedBarPlotData.x.indexOf(attributeValue);
        // Count positive and negative cases based on class_
        if (patient.class_ === 'Positive') {
          this.StackedBarPlotData.countPositive[attributeIndex]++;
        } else if (patient.class_ === 'Negative') {
          this.StackedBarPlotData.countNegative[attributeIndex]++;
        }

      })

      // Draw the stacked bar plot after data transformation
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
        marker: { color: '#CB6040' },
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
        barmode: 'stack', // Stacked bar plot
        xaxis: {
         // title: "Subgroups",
          //tickangle: -45
        },
        yaxis: {
          title: "Number of Samples"
        }
      };

      const config = { responsive: true, displayModeBar: false };
      Plotly.react('myStackedBarPlot', data, layout, config);
    },
  },

  watch: {
    // Watch the `selectedValue` instead of `selectedAttribute`
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
  //height: 800px;
  font-size: 50px;
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

.custom-select {
  width: 100%;  /* Make v-select fill the parent container */
}

.custom-select .v-select__input {
  font-size: 50px !important; /* Set font size of the input */
  height: 40px !important; /* Adjust height of the input */
}

/* Adjust the outline border height */
.custom-select .v-field__outline {
  height: 50px !important; /* Set the height of the outline */
}

/* Adjust the dropdown menu's font size */
.custom-select .v-select__menu {
  font-size: 50px !important; /* Set font size for the dropdown items */
}

/* Adjust the label's font size */
.custom-select .v-label {
  font-size: 50px !important; /* Adjust label font size */
}
</style>