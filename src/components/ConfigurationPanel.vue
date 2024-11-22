
<template>
  <div>
    <v-container fluid>
      <v-row>
        <!-- Main Content Section (First and Second Rows) -->
        <v-col cols="12" style="height: 100vh">
          <!-- StackedBarPlotPlot Section -->
          <v-row style="height: 100%">
            <v-col cols="12" style="height: 100%">
              <v-card style="height: 100%">
                <StackedBarPlot
                    :key="StackedBarPlotId"
                />
              </v-card>
            </v-col>
          </v-row>

          <!-- Sankey -->
          <v-row style="height: 100%">
            <v-col cols="12" style="height:90%; width: 100%; padding: 0">
              <v-card style="height: 100%; overflow-y: auto">
                <div>
                  <h2>Sankey Diagrams for What-If Analysis</h2>
                </div>

                <SankeyDiagram/>
              </v-card>
            </v-col>
          </v-row>

          <!-- Form -->
          <v-row style="height: 50%">
            <v-col cols="12" style="height: 100%; width: 100%; padding: 0">
              <v-card style="height: 100%; overflow-y: auto;">
                <IndividualForm/>
              </v-card>
            </v-col>
          </v-row>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>



<script>
import StackedBarPlot from './LineBarPlot';
import IndividualForm from './IndividualForm';
import SankeyDiagram from './SankeyDiagram.vue';



export default {
  components: {SankeyDiagram, IndividualForm,   StackedBarPlot},
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
  font-size: 12px;
}
</style>
