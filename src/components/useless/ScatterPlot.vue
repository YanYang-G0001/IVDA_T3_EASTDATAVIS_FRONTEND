<template>
  <div>
    <v-row align="center" justify="center" class="mt-1 mb-0">
      <h3>Overview of
        <span :style="{textTransform: 'uppercase' }">
          {{ $props.selectedCategory }}
        </span>
          Companies</h3>
    </v-row>
    <div style="height: 95%">
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
    ScatterPlotData: {x: [], y: [], companyname:[],name: [],category: [],companyId:[]}}),
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
        this.ScatterPlotData.companyname.push(company.name)
        this.ScatterPlotData.x.push(company.founding_year)
        this.ScatterPlotData.y.push(company.employees)
        this.ScatterPlotData.category.push(company.category) //encode color
        this.ScatterPlotData.companyId.push(company.id) //to handle click
      })
      // after the data is loaded, draw the plot
      this.drawScatterPlot()
    },
    clickScatterPlot() {
      var that = this
      var myPlot = document.getElementById('myScatterPlot')
      myPlot.on('plotly_click', function (data) {
        for (var i = 0; i < data.points.length; i++) {
          // get the company id of point
          let pn = data.points[i].customdata;
          console.log('clickevent:', pn);
          // get trace index
          let traceInd = data.points[i].curveNumber;
          // get the index of point
          let ind = data.points[i].pointNumber;
          // emit event to change the currently selected company in the a) configuration panel
          // and b) update the Profit View
          that.$emit('changeCurrentlySelectedCompany', pn)
          // revert all colors
          var colors = ['#00000' * 5]
          var un_colors = ['#00000' * 15]
          // and change currently selected color to blue
          colors[ind] = '#3777ee';
          // update the marker and plot
         // var update = {'marker': {color: colors, size: 12}};
          //update all data point into balck
          var update1 = {'marker': {color: un_colors, size: 12} };
          Plotly.restyle('myScatterPlot', update1);
          //update color of selected point in selected trace
          var update2 = {'marker': {color: colors, size: 12} };
          Plotly.restyle('myScatterPlot', update2, [traceInd]);
         // Plotly.restyle('myScatterPlot', update);
        }
      });
    },
    drawScatterPlot() {
      //Assign colors for each cat
      const categoryColors = {
        'tech': "green",
        'health': "orange",
        'bank': "red"
      };
      //map color
      /*
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
        yaxis:{title: "Employee Number"},
        showlegend:true
      };
      var config = {responsive: true, displayModeBar: false}
      Plotly.newPlot('myScatterPlot', data,layout, config);
      this.clickScatterPlot()

    }*/
      const traces = {};
      this.ScatterPlotData.category.forEach((category, index) => {
        if (!traces[category]) {
          traces[category] = {
            x: [],
            y: [],
            customdata: [],
            companyname: [],
            mode: 'markers',
            type: 'scatter',
            text: [],
            hoverinfo:'text'+'y',
            name: category, // Legend entry name
            marker: {
              color: categoryColors[category] || "black", // Use black for unknown categories
              size: 12
            }
          };

        }
        // Push data points to the appropriate trace
        traces[category].x.push(this.ScatterPlotData.x[index]);
        traces[category].y.push(this.ScatterPlotData.y[index]);
        traces[category].customdata.push(this.ScatterPlotData.companyId[index]);
        traces[category].text.push(this.ScatterPlotData.companyname[index])
      });
      // Convert traces object to an array
      const data = Object.values(traces);

      const layout = {
        xaxis: {title: "Founding Year"},
        yaxis: {title: "Employee Number"},
        showlegend: true // Ensure the legend is displayed
      };

      const config = {responsive: true, displayModeBar: false};
      Plotly.newPlot('myScatterPlot', data, layout, config);
      this.clickScatterPlot();
    }
  },
  watch: {
    selectedCategory: function () {
      this.ScatterPlotData.x = [];
      this.ScatterPlotData.y = [];
      this.ScatterPlotData.name=[];
      this.ScatterPlotData.companyname=[];
      this.ScatterPlotData.category=[];
      this.ScatterPlotData.companyId=[];

      this.fetchData();
    }
  }

}

</script>
