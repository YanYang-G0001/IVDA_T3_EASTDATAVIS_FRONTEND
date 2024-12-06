<template>
  <div class="diabetes-dashboard">
    <div class="dashboard-header">
      <h2>Health Metrics Dashboard</h2>
    </div>

    <!-- Patient Type Selector -->
    <div class="patient-type-selector">
      <button
          :class="{ 'active': selectedPatientType === 'diabetic' }"
          @click="selectedPatientType = 'diabetic'"
      >
        Diabetic
      </button>
      <button
          :class="{ 'active': selectedPatientType === 'non-diabetic' }"
          @click="selectedPatientType = 'non-diabetic'"
      >
        Non-Diabetic
      </button>
    </div>

    <div class="dashboard-metrics">
      <v-row wrap>
        <v-col md="4" sm="6" xs="12">
          <div class="metric">
            <div class="metric-label">Total Population</div>
            <div class="metric-value">
              {{ totalPatientNum }}
            </div>
          </div>
        </v-col>
        <v-col md="4" sm="6" xs="12">
          <div class="metric">
            <div class="metric-label">Glucose Average</div>
            <div class="metric-value">
              {{ glucoseAverage }}
            </div>
          </div>
        </v-col>
        <v-col md="4" sm="6" xs="12">
          <div class="metric">
            <div class="metric-label">Age Average</div>
            <div class="metric-value">
              {{ ageAverage }}
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row wrap>
        <v-col md="4" sm="6" xs="12">
          <div class="metric">
            <div class="metric-label">BMI Average</div>
            <div class="metric-value">
              {{ bmiAverage }}
            </div>
          </div>
        </v-col>
        <v-col md="4" sm="6" xs="12">
          <div class="metric">
            <div class="metric-label">Insulin Average</div>
            <div class="metric-value">
              {{ insulinAverage }}
            </div>
          </div>
        </v-col>
        <v-col md="4" sm="6" xs="12">
          <div class="metric">
            <div class="metric-label">BP Average</div>
            <div class="metric-value">
              {{ bpAverage }}
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

  </div>
</template>

<script>
export default {
  name: 'OverviewDashboard',

  data() {
    return {
      // Diabetic patient metrics
      ageAverageDiabetic: 37,
      bmiAverageDiabetic: 35,
      avgPregnancyDiabetic: 5,
      totalPatientsDiabetic: 268,
      glucoseAverageDiabetic: 141.98,
      bloodPressureAverageDiabetic:75,
      insulinAverageDiabetic:202.49,


      // Non-diabetic patient metrics
      ageAverageNonDiabetic: 31,
      bmiAverageNonDiabetic: 31,
      avgPregnancyNonDiabetic: 3,
      totalPatientsNonDiabetic: 500,
      glucoseAverageNonDiabetic:110.53,
      bloodPressureAverageNonDiabetic:70,
      insulinAverageNonDiabetic:128.10,

      totalPatients: 768,
      selectedPatientType: 'diabetic' // Default to diabetic patients
    };
  },
  computed: {
    ageAverage() {
      return this.selectedPatientType === 'diabetic'
          ? this.ageAverageDiabetic
          : this.ageAverageNonDiabetic;
    },
    bmiAverage() {
      return this.selectedPatientType === 'diabetic'
          ? this.bmiAverageDiabetic
          : this.bmiAverageNonDiabetic;
    },
    glucoseAverage() {
      return this.selectedPatientType === 'diabetic'
          ? this.glucoseAverageDiabetic
          : this.glucoseAverageNonDiabetic;
    },
    insulinAverage() {
      return this.selectedPatientType === 'diabetic'
          ? this.insulinAverageDiabetic
          : this.insulinAverageNonDiabetic;
    },
    bpAverage() {
      return this.selectedPatientType === 'diabetic'
          ? this.bloodPressureAverageDiabetic
          : this.bloodPressureAverageNonDiabetic;
    },
    totalPatientNum() {
      return this.selectedPatientType === 'diabetic'
          ? this.totalPatientsDiabetic
          : this.totalPatientsNonDiabetic;
    }
  },
  methods: {
    selectPatientType(type) {
      this.selectedPatientType = type;
    }
  }
};
</script>

<style scoped>
.diabetes-dashboard {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  height: 565px;
}

.dashboard-header {
  background-color: #1F4529;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.dashboard-header h2 {
  font-size: 34px;
  font-weight: 500;
  margin: 0;
}

.dashboard-metrics {
  //display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: nowrap;
}

.metric {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
  flex: 1;
  max-width: 400px;
  margin-bottom: 20px;
}

.metric-label {
  font-size: 25px;
  font-weight: 500;
  color: #4A628A;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.patient-type-selector {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.patient-type-selector button {
  background-color:#4A628A ;
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 24px;
  border-radius: 4px;
  margin: 50px 50px;
  cursor: pointer;


}

.patient-type-selector button.active {
  background-color: #1F4529;
}
</style>