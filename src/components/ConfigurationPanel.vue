
<template>
  <div>
    <v-container fluid>
      <!-- Overview -->
      <v-row style="height: 100%">
        <v-col cols="8" style="height: 100%; width: 100%; padding: 10px">
          <v-card style="height: 100%; overflow-y: auto;">
            <HighRiskAttribute/>
          </v-card>
        </v-col>
        <v-col cols="4" style="height: 100%; width: 100%; padding: 10px">
          <v-card style="height: 565px; overflow-y: auto;">
            <OverviewDashboard/>
          </v-card>
        </v-col>

      </v-row>

      <!-- Second Row -->
      <v-row>
        <v-col cols="8" style="height: 800px">
          <!-- StackedBarPlotPlot Section -->
          <v-card style="height: 100%">
            <StackedBarPlot
                :key="StackedBarPlotId"
            />
          </v-card>
        </v-col>
        <!-- Form -->
        <v-col cols="4" style="height:800px; width: 100%">
          <v-card style="height: 100%">
            <IndividualForm/>
          </v-card>
        </v-col>
      </v-row>

      <!-- Third Row -->
          <!-- Sankey -->
          <v-row style="height: 100%">
            <v-col cols="12" style="height: 100%; width: 100%; padding: 0">
              <v-card style="height: 100%; overflow-y: auto;">
                <div class="dashboard-header">
                  <v-row align="center" justify="center" class="mt-1 mb-0">
                  <h2 >Sankey Diagrams for What-If Analysis</h2>
                  </v-row>
                </div>
                <SankeyDiagram/>
              </v-card>
            </v-col>
          </v-row>

    </v-container>
  </div>
</template>



<script>
import StackedBarPlot from './LineBarPlot';
import IndividualForm from './IndividualForm';
import SankeyDiagram from './SankeyDiagram.vue';
import OverviewDashboard from './Overview.vue';
import HighRiskAttribute from './HighRiskBar.vue';


export default {
  components: {HighRiskAttribute, SankeyDiagram, IndividualForm,   StackedBarPlot, OverviewDashboard},
  data: () => ({
    scatterPlotId: 0,
    StackedBarPlotId: 0,
    SankeyDiagramId:0,
  }),
  methods: {

    }

}

</script>

<style scoped>
body{
  background: #F3F3E0;
}
.control-panel-font {
  font-family: "Open Sans", verdana, arial, sans-serif;
  align-items: center;
  font-size: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  font-weight: 600;
  height: 40px;
  color:black;
}
.sideBar {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 17px;
  height: calc(100vh - 50px);
  background: linear-gradient(to bottom, #ffffff, #6c6fbe);
}
.appendix {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: gray;
}
.v-card {
  background-color: #fafafa; /* Custom light cyan background */
  left:10px;
}
.dashboard-header {
  background-color: #1F4529;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}
.dashboard-header h2 {
  font-family: 'Roboto', sans-serif;
  font-size: 34px;
  font-weight: 500;
  margin: 0;
}
</style>
