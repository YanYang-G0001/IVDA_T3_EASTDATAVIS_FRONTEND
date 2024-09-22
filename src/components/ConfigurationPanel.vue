
<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2" class="sideBar">
            <v-row>
              <v-col cols="12" sm="12">
                <div class="control-panel-font">Company Overview</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <v-select
                    :items="categories.values"
                    label="Select a category"
                    dense
                    v-model="categories.selectedValue"
                    @change="changeCategory"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="12">
                <div class="control-panel-font">Profit View of Company</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <v-select
                    :items="companies.values"
                    label="Select a company"
                    dense
                    v-model="companies.selectedValue"
                    @change="changeCompany"
                ></v-select>
                <v-select
                    :items="algorithm.values"
                    label="Select an algorithm"
                    dense
                    v-model="algorithm.selectedValue"
                    @change="changeAlgorithm"
                ></v-select>
              </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" md="5">
          <v-card>
            <ScatterPlot :key="scatterPlotId"
                         :selectedCategory="categories.selectedValue"
                         @changeCurrentlySelectedCompany="changeCurrentlySelectedCompany"
            />
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card>
            <LinePlot :key="linePlotId"
                      :selectedCompany="companies.selectedValue"
                      :selectedAlgorithm="algorithm.selectedValue"/>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import ScatterPlot from './ScatterPlot';
import LinePlot from './LinePlot';
export default {
  components: {ScatterPlot, LinePlot},
  data: () => ({
    scatterPlotId: 0,
    linePlotId: 0,
    categories: {
      values: ['All', 'tech', 'health', 'bank'],
      selectedValue: 'All'
    },
    companies: {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      selectedValue: 1
    },
    algorithm: {
      values: ['none', 'random', 'regression'],
      selectedValue: 'none'
    }
  }),
  methods: {
    changeCategory() {
    this.scatterPlotId += 1
  },
    changeCompany() {
      this.linePlotId += 1
    },
    changeAlgorithm() {
      this.linePlotId += 1
    },
    changeCurrentlySelectedCompany(companyId) {
      this.companies.selectedValue = companyId
      this.changeCompany()
    }
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

</style>
