<template>
  <div>
    <v-row align="center" justify="center" class="mt-1 mb-0">
      <h3>Overview of {{ $props.selectedCategory }} Companies</h3>
    </v-row>
    <div style="height: 90vh">
      <div id='myScatterPlot' style="height: inherit"></div>
    </div>
  </div>
</template>
<script>
import Plotly from 'plotly.js/dist/plotly';
export default {
  name: "ScatterPlot",
  props: [
    "selectedCategory"
  ],

  // data() is used to define the data object, vue will automatically update to DOM
  data: () => ({
    ScatterPlotData: {x: [], y: [], name: [],category: []}}),
  // mounted() used to initialize data, it will be called after component is rendered to DOM
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      // req URL to retrieve companies from backend
      var reqUrl = 'http://127.0.0.1:5000/companies?category=' + this.$props.selectedCategory
      console.log("ReqURL " + reqUrl)
      // await response and data
      const response = await fetch(reqUrl)
      const responseData = await response.json();
      // transform data to usable by scatterplot
      responseData.forEach((company) => {
        this.ScatterPlotData.name.push(company.name)
        this.ScatterPlotData.x.push(company.founding_year)
        this.ScatterPlotData.y.push(company.employees)
        this.ScatterPlotData.category.push(company.category) //encode color
      })
      // after the data is loaded, draw the plot
      this.drawScatterPlot()
    },
    clickScatterPlot() {
      var that = this
      var myPlot = document.getElementById('myScatterPlot')
      myPlot.on('plotly_click', function (data) {
        for (var i = 0; i < data.points.length; i++) {
          // get the index of point
          let pn = data.points[i].pointNumber;
          // emit event to change the currently selected company in the a) configuration panel
          // and b) update the Profit View
          that.$emit('changeCurrentlySelectedCompany', pn + 1)
          // revert all colors
          var colors = ['#00000' * 15]
          // and change currently selected color to blue
          colors[pn] = '#3777ee';

          // update the marker and plot
          var update = {'marker': {color: colors, size: 12}};
          Plotly.restyle('myScatterPlot', update);
        }
      });
    },
    drawScatterPlot() {
      //Assign colors for each cat
      const categoryColors = {
        'tech':"green",
        'health':"orange",
        'bank':"red"
      };
      //map color
      let colors = this.ScatterPlotData.category.map(category =>{
        return categoryColors[category] || "black"; //Use black for unknown cat
      });

      var trace1 = {
        x: this.ScatterPlotData.x,
        y: this.ScatterPlotData.y,
        mode: 'markers',
        type: 'scatter',
        text: this.ScatterPlotData.name,
        marker:{
          color: colors,
          size:12
        }
      };
      var data = [trace1];
      var layout = {
        xaxis:{title: "Founding Year"},
        yaxis:{title: "Employee Number"}
      };
      var config = {responsive: true, displayModeBar: false}
      Plotly.newPlot('myScatterPlot', data,layout, config);
      this.clickScatterPlot()

    }
  },
  watch: {
    selectedCategory: function () {
      this.ScatterPlotData.x = [];
      this.ScatterPlotData.y = [];

      this.fetchData();
    }
  }

}

</script>
