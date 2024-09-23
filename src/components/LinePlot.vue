<template>
  <div>
    <v-row align="center" justify="center" class="mt-1 mb-0">
      <h3>Profit View of Company: {{ $props.selectedCompany }}</h3>
    </v-row>
    <div style="height: 90vh">
      <div id='myLinePlot' style="height: inherit"></div>
    </div>
  </div>
</template>

<script>
import Plotly from 'plotly.js/dist/plotly';
export default {
  name: "LinePlot",
  // defined in parent component, no need to import, already be rendered in the template
  props: ["selectedCompany", "selectedAlgorithm"],
  data: () => ({
    LinePlotData: {x: [], y: []},
    LinePlotData_pre: {x_pre: [], y_pre: []}
  }),
  mounted() {
    this.fetchData()
  },
  methods: {
 async fetchData() {
   try{

     // req URL to retrieve single company from backend
      var reqUrl = 'http://127.0.0.1:5000/companies/' + this.$props.selectedCompany +
          '?algorithm=' + this.$props.selectedAlgorithm
      console.log("ReqURL " + reqUrl)}
   catch(error){ console.error('Error fetching companies:' );
   }
      // await response and data
      const response = await fetch(reqUrl)
      const responseData = await response.json();
      // transform data to usable by lineplot
      responseData.profit.forEach((profit) => {
        if (profit.year<=2021) {
          this.LinePlotData.x.push(profit.year)
          this.LinePlotData.y.push(profit.value)
        }//line connects 2021 and 2022 is predicted
        if (profit.year>=2021) {
          this.LinePlotData_pre.x_pre.push(profit.year)
          this.LinePlotData_pre.y_pre.push(profit.value)
        }

      })
      // draw the lineplot after the data is transformed
      this.drawLinePlot()
    },
    drawLinePlot() {
      var trace1 = {
        x: this.LinePlotData.x,
        y: this.LinePlotData.y,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'actual profit',
        line: {color:'black'}
      };
      var trace2 = {
        x: this.LinePlotData_pre.x_pre,
        y: this.LinePlotData_pre.y_pre,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'predict profit',
        line: {color:'red', dash: 'dash'}
      };
      //pay attention to the plot order/layer
      var data = [trace2,trace1];
      var layout = {
        xaxis:{title: "Year"},
        yaxis:{title: "Profit"}

      };
      var config = {responsive: true, displayModeBar: false}
      Plotly.newPlot('myLinePlot', data, layout, config);

    }
  },
  watch: {
    selectedCompany() {
      this.LinePlotData.x = [];
      this.LinePlotData.y = [];
      this.LinePlotData_pre.x_pre = [];
      this.LinePlotData_pre.y_pre = [];

      this.fetchData();
    },
    selectedAlgorithm() {
      this.LinePlotData.x = [];
      this.LinePlotData.y = [];
      this.LinePlotData_pre.x_pre = [];
      this.LinePlotData_pre.y_pre = [];

      this.fetchData();
    }
  }
}
</script>
