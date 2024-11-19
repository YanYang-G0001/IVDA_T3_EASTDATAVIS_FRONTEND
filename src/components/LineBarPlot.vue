<template>
  <div>
    <v-row align="center" justify="center" class="mt-1 mb-0">
      <div>
      <h3>Factors Highly Associated with Diabetes</h3>
      </div>
    </v-row>

    <div style="height: 95%">
      <div id='myLineBarPlot' style="height: inherit"></div>
    </div>
  </div>
</template>

<script>
import Plotly from 'plotly.js/dist/plotly';
import {blue} from "vuetify/util/colors";
export default {
  name: "LineBarPlot",
  computed: {
    blue() {
      return blue
    }
  },
  // defined in parent component, no need to import, already be rendered in the template
  props: ["selectedCategory","selectedCompany"],
  data: () => ({
    LineBarPlotData: {x: [], y: [],category:[],companyId:[],avgEmployees:0}
  }),
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try{
        // req URL to retrieve single company from backend
        var reqUrl = 'http://127.0.0.1:5000/companies?category=' + this.$props.selectedCategory
        console.log("ReqURLforLinebarPlot " + reqUrl)}
      catch(error){ console.error('Error fetching companies:' );
      }
      // await response and data
      const response = await fetch(reqUrl)
      const responseData = await response.json();
      // transform data to usable by lineplot
      responseData.forEach((company) => {
        this.LineBarPlotData.x.push(company.name)
        this.LineBarPlotData.y.push(company.employees)
        this.LineBarPlotData.category.push(company.category)
        this.LineBarPlotData.companyId.push(company.id)//encode color
      })
      // Calculate average employees
      this.avgEmployees = this.LineBarPlotData.y.reduce((sum, num) => sum + num, 0) / this.LineBarPlotData.y.length;
      // draw the lineplot after the data is transformed
      this.drawLineBarPlot()
    },
    drawLineBarPlot() {
      const selectedCompanyId = this.$props.selectedCompany;
      console.log('Selected Company ID:', selectedCompanyId);

      const colors = this.LineBarPlotData.companyId.map(id =>
          id === selectedCompanyId ? '#3777ee' : 'grey'
      );
      var trace1 = {
        x: this.LineBarPlotData.x,
        y: this.LineBarPlotData.y,
        type: 'bar',
        name: 'Employee number',
        text: this.LineBarPlotData.y.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        marker:{color:colors}
      };
      // Average line trace
      var trace2 = {
        x: this.LineBarPlotData.x,
        y: Array(this.LineBarPlotData.x.length).fill(this.avgEmployees), // fill y with average
        type: 'scatter', // Line type
        mode: 'lines',
        name: 'Average Employees',
        hoverinfo: 'y',
        line: { color: 'red', width: 2, dash: 'dash' } // style the line
      };
      //pay attention to the plot order/layer
      var data = [trace1,trace2];
      var layout = {
        xaxis:{title: "Company",
        tickangle:-45},
        yaxis:{title: "Employee Number"}

      };
      var config = {responsive: true, displayModeBar: false}
      Plotly.newPlot('myLineBarPlot', data, layout, config);

    }
  },
  watch: {
    selectedCategory: function () {
      this.LineBarPlotData.x = [];
      this.LineBarPlotData.y = [];
      this.LineBarPlotData.companyId=[];
      this.LineBarPlotData.category=[];
      this.fetchData();
    },
    selectedCompany: function () {
      this.LineBarPlotData.x = [];
      this.LineBarPlotData.y = [];
      this.LineBarPlotData.companyId=[];
      this.LineBarPlotData.category=[];
      this.fetchData();

    },
  }
}
</script>
