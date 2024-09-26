<template>
  <div>
    <v-row align="center" justify="center" class="mt-1 mb-0">
      <div>
      <h3>Employee# of {{ $props.selectedCategory }} Companies</h3>
      <p class="subtitle">Selected company is highlighted</p>
      </div>
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
  props: ["selectedCategory","selectedCompany"],
  data: () => ({
    LineBarPlotData: {x: [], y: [],category:[],companyId:[]}
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
        this.LineBarPlotData.category.push(company.category)
        this.LineBarPlotData.companyId.push(company.id)//encode color
      })
      // draw the lineplot after the data is transformed
      this.drawLineBarPlot()
    },
    drawLineBarPlot() {
      const selectedCompanyId = this.$props.selectedCompany;
      const colors = this.LineBarPlotData.companyId.map(id =>
          id === selectedCompanyId ? '#3777ee' : 'grey'
      );
      var trace1 = {
        x: this.LineBarPlotData.x,
        y: this.LineBarPlotData.y,
        type: 'bar',
        text: this.LineBarPlotData.y.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        marker:{color:colors}
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
    },
    selectedCompany() {
      this.LineBarPlotData.x = [];
      this.LineBarPlotData.y = [];
      this.fetchData();
    },
  }
}
</script>
