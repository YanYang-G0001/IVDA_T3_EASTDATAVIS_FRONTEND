
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
                    item-title="name"
                    item-value="id"
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
      values: [{id: 1, name: "alphabet"},
        {id: 2, name: "apple"},
        {id: 3, name: "amazon"},
        {id: 4, name: "microsoft"},
        {id: 5, name: "meta"},
        {id: 6, name: "united health"},
        {id: 7, name: "johnson and johnson"},
        {id: 8, name: "pfizer"},
        {id: 9, name: "cvs health"},
        {id: 10, name: "mckesson"},
        {id: 11, name: "ubs"},
        {id: 12, name: "credit suisse"},
        {id: 13, name: "jp morgan"},
        {id: 14, name: "goldman sachs"},
        {id: 15, name: "bank of america"}],
      selectedValue: 1 //default value
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
