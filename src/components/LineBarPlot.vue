<template>
  <div>
    <v-row align="center" justify="center" class="mt-1 mb-0">
      <h3>Employee# of {{ $props.selectedCategory }} Companies</h3>
    </v-row>
    <div style="height: 90vh">
      <div id='myLineBarPlot' style="height: inherit"></div>
    </div>
  </div>
</template>

<script>
import Plotly from 'plotly.js/dist/plotly';
export default {
  name: "LineBarPlot",
  // defined in parent component, no need to import, already be rendered in the template
  props: ["selectedCategory"],
  data: () => ({
    LineBarPlotData: {x: [], y: [],category:[]},
    //LineBarPlotData_pre: {x_pre: [], y_pre: []},
    companyName:''
  }),
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try{
        // req URL to retrieve single company from backend
        var reqUrl = 'http://127.0.0.1:5000/companies?category=' + this.$props.selectedCategory
        console.log("ReqURL " + reqUrl)}
      catch(error){ console.error('Error fetching companies:' );
      }
      // await response and data
      const response = await fetch(reqUrl)
      const responseData = await response.json();
      this.companyName = responseData.name //extract company name to display in title
      // transform data to usable by lineplot
      responseData.forEach((company) => {
        this.LineBarPlotData.x.push(company.name)
        this.LineBarPlotData.y.push(company.employees)
        this.LineBarPlotData.category.push(company.category) //encode color
      })
      // draw the lineplot after the data is transformed
      this.drawLineBarPlot()
    },
    drawLineBarPlot() {
      var trace1 = {
        x: this.LineBarPlotData.x,
        y: this.LineBarPlotData.y,
        type: 'bar',
        text: this.LineBarPlotData.y.map(String),
        textposition: 'auto',
        hoverinfo: 'none'

      };
      //pay attention to the plot order/layer
      var data = [trace1];
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

      this.fetchData();
    }
  }
}
</script>
