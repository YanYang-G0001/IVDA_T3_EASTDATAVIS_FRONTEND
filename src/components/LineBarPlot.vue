<template>
  <div>
    <v-container fluid style="padding: 0; height: 100vh;">
      <v-row align="center" justify="center" class="mt-1 mb-0">
        <div>
          <h3>Diabetes Distribution In Subgroups</h3>
        </div>
      </v-row>
    <!-- Category selection dropdown -->
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



    <div style="height: 80%">
      <div id='myStackedBarPlot' style="height: 100%; width: 100%"></div>
    </div>
    </v-container>
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
            .join('-'); // Combine the selected categories into one string, like 'gender-male-polyuria-yes'

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
        x: this.StackedBarPlotData.x,
        y: this.StackedBarPlotData.countPositive,
        type: 'bar',
        name: 'Positive',
        text: this.StackedBarPlotData.countPositive.map(String),
        textposition: 'auto',
        hoverinfo: 'x+y+name',
        marker: { color: 'red' },
      };

      const trace2 = {
        x: this.StackedBarPlotData.x,
        y: this.StackedBarPlotData.countNegative,
        type: 'bar',
        name: 'Negative',
        text: this.StackedBarPlotData.countNegative.map(String),
        textposition: 'auto',
        hoverinfo: 'x+y+name',
        marker: { color: 'grey' },
      };

      const data = [trace1, trace2];

      const layout = {
        barmode: 'stack', // Stacked bar plot
        xaxis: {
          title: "Attribute Categories",
          //tickangle: -45
        },
        yaxis: {
          title: "Number of Samples"
        }
      };

      const config = { responsive: true, displayModeBar: false };
      Plotly.newPlot('myStackedBarPlot', data, layout, config);
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